import os
import io
import mimetypes
import tempfile
import requests
from lighthouseweb3 import Lighthouse

from rsa import (
    generate_rsa_keypair,
    keys_to_pem,
    encrypt_message,
    decrypt_message,
)

def _get_lighthouse_client():
    token = os.environ.get("LIGHTHOUSE_TOKEN")
    if not token:
        raise RuntimeError("LIGHTHOUSE_TOKEN env var is missing")
    return Lighthouse(token=token)

def _extract_cid(upload_response: dict) -> str:
    if not upload_response:
        raise ValueError("Empty upload response")
    
    if isinstance(upload_response, dict):
        data = upload_response.get("data") or upload_response
        for key in ("Hash", "hash", "cid", "CID"):
            if key in data:
                return data[key]
        
        for v in data.values():
            if isinstance(v, str) and v.startswith(("Qm", "bafy")):
                return v
    raise KeyError(f"Could not find CID in upload response: {upload_response}")

def _persist_in_tempfile(file_like, filename_hint: str | None = None) -> str:
    suffix = ""
    if filename_hint and "." in filename_hint:
        suffix = "." + filename_hint.split(".")[-1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        
        if hasattr(file_like, "read"):
            chunk = file_like.read(8192)
            while chunk:
                tmp.write(chunk)
                chunk = file_like.read(8192)
            try:
                file_like.seek(0)  
            except Exception:
                pass
        else:
            
            raise TypeError("Expected a file-like object; got path/unknown type.")
        return tmp.name


# Public API


def add_file_to_ipfs(file, public_pem: str) -> str:

    lh = _get_lighthouse_client()

    
    filename_hint = getattr(file, "filename", None)

    
    temp_path = _persist_in_tempfile(file, filename_hint=filename_hint)

    try:
        # 2) Upload via Lighthouse SDK (expects a path)
        upload_resp = lh.upload(temp_path)  # returns dict with cid/hash
        cid = _extract_cid(upload_resp)

        # 3) Encrypt and return encrypted CID
        encrypted_cid = encrypt_message(public_pem, cid)
        return encrypted_cid
    except Exception as e:
        raise RuntimeError(f"Lighthouse upload failed: {e}") from e
    finally:
        # 4) Cleanup temp file
        try:
            os.remove(temp_path)
        except Exception:
            pass


def get_file_from_ipfs(encrypted_cid: str, private_pem: str) -> tuple[io.BytesIO, str]:

    
    cid = decrypt_message(private_pem, encrypted_cid)

    # 2) Fetch via public gateway
    gateway_url = f"https://gateway.lighthouse.storage/ipfs/{cid}"

    try:
        with requests.get(gateway_url, stream=True, timeout=60) as resp:
            if resp.status_code != 200:
                detail = resp.text[:200] if resp.text else ""
                raise RuntimeError(
                    f"Failed to fetch file. Status {resp.status_code}. {detail}"
                )

            # 3) Stream into memory buffer
            buf = io.BytesIO()
            for chunk in resp.iter_content(chunk_size=8192):
                if chunk:
                    buf.write(chunk)
            buf.seek(0)

            
            
            mime_type = resp.headers.get("Content-Type")
            if not mime_type or ";" in mime_type:
                
                guessed, _ = mimetypes.guess_type("")  # will be None
                mime_type = (guessed or (mime_type.split(";")[0] if mime_type else None)
                             or "application/octet-stream")

            return buf, mime_type

    except requests.RequestException as e:
        raise RuntimeError(f"Network error while retrieving file: {e}") from e
    except Exception as e:
        raise
