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
    print("Getting token")
    token = os.environ.get("LIGHTHOUSE_TOKEN")
    if not token:
        raise RuntimeError("LIGHTHOUSE_TOKEN env var is missing")
    print("Token: ", token)
    lh = Lighthouse(token=token)
    print(lh)
    return lh

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
    print("Getting client")
    lh = _get_lighthouse_client()
    print("lh: ", lh)
    
    filename_hint = getattr(file, "filename", None)
    print("filename_hint: ", filename_hint)

    temp_path = _persist_in_tempfile(file, filename_hint=filename_hint)
    print("temp_path: ", temp_path)
    try:
        print("uploading to lighthouse")
        # 2) Upload via Lighthouse SDK (expects a path)
        upload_resp = lh.upload(temp_path)  # returns dict with cid/hash
        print("upload_resp: ", upload_resp)
        cid = _extract_cid(upload_resp)
        print("cid: ", cid) 
        # 3) Encrypt and return encrypted CID
        encrypted_cid = encrypt_message(public_pem, cid)
        print("encrypted_cid: ", encrypted_cid)
        return encrypted_cid
    except Exception as e:
        raise RuntimeError(f"Lighthouse upload failed: {e}") from e
    finally:
        # 4) Cleanup temp file
        try:
            os.remove(temp_path)
        except Exception:
            pass


def get_file_from_ipfs(encrypted_cid_hex: str, private_pem: str) -> tuple[io.BytesIO, str]:

    print("Getting file from IPFS")
    # 1) Decrypt the CID first
    cid = decrypt_message(private_pem, encrypted_cid_hex)
    print("cid: ", cid)
    
    if not cid:
        raise RuntimeError("Failed to decrypt CID")

    try:
        # 2) Get Lighthouse client
        lh = _get_lighthouse_client()
        
        # 3) Download file using Lighthouse SDK
        print(f"Downloading file with CID: {cid}")
        file_info = lh.download(cid)  # Returns tuple (file_content, metadata)
        
        if not file_info or len(file_info) < 1:
            raise RuntimeError("Failed to download file from Lighthouse")
        
        file_content = file_info[0]  # Get the file content
        print(f"Downloaded file size: {len(file_content)} bytes")
        
        # 4) Create BytesIO buffer from the downloaded content
        buf = io.BytesIO(file_content)
        buf.seek(0)
        
        # 5) Try to determine MIME type
        mime_type = "application/octet-stream"  # Default
        
        # If metadata is available in the tuple, try to extract MIME type
        if len(file_info) > 1 and isinstance(file_info[1], dict):
            metadata = file_info[1]
            mime_type = metadata.get("content_type") or metadata.get("mimetype") or mime_type
        
        # Fallback: guess MIME type from content (basic detection)
        if mime_type == "application/octet-stream":
            # Check for common file signatures
            file_content_start = file_content[:10] if len(file_content) >= 10 else file_content
            if file_content_start.startswith(b'\xFF\xD8\xFF'):
                mime_type = "image/jpeg"
            elif file_content_start.startswith(b'\x89PNG'):
                mime_type = "image/png"
            elif file_content_start.startswith(b'%PDF'):
                mime_type = "application/pdf"
            elif file_content_start.startswith(b'PK'):
                mime_type = "application/zip"
        
        return buf, mime_type

    except Exception as e:
        print(f"Error downloading from Lighthouse: {e}")
        raise RuntimeError(f"Failed to download file from IPFS: {e}") from e
