from flask import Flask, jsonify, request, send_file
#from rsa_keygen import generate_rsa_keypair, keys_to_pem, encrypt_message, decrypt_message
from rsa import generate_rsa_keypair, keys_to_pem, encrypt_message, decrypt_message
from ipfs import add_file_to_ipfs, get_file_from_ipfs
from werkzeug.utils import secure_filename
from getFingerprint import fingerprint_scan
import os 

from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/api/generate_keys', methods=['POST'])
def generate_keys():
    user_input = request.json['user_input'] 
    print("fingerprint should start here")
    success = fingerprint_scan()
    print(success)
    if success: 
        print("sending for generation")
        public_key, private_key = generate_rsa_keypair('kjkszpj')
        print("done with generation")
        public_pem, private_pem = keys_to_pem(public_key, private_key)
    else: 
        print("authentication unsuccessful")
    
    return jsonify({'public_key': public_pem, 'private_key': private_pem})


@app.route('/api/encrypt', methods=['POST'])
def encrypt():
    public_pem = request.json['public_pem']
    message = request.json['message']
    encrypted_message = encrypt_message(public_pem, message)
    return jsonify({'encrypted_message': encrypted_message})


# Route to decrypt a message
@app.route('/api/decrypt', methods=['POST'])
def decrypt():
    try:
        # Extract input data
        private_pem = request.json.get('private_pem')
        ciphertext_hex = request.json.get('ciphertext')
        
    
        if not private_pem or not ciphertext_hex:
            return jsonify({'error': 'private_pem and ciphertext are required'}), 400
        
        # Perform fingerprint authentication
        # success = fingerprint_scan()
        
        if fingerprint_scan():
            # Convert ciphertext from hex and decrypt
            ciphertext = bytes.fromhex(ciphertext_hex)
            decrypted_message = decrypt_message(private_pem, ciphertext_hex)
            return jsonify({'decrypted_message': decrypted_message})
        else:
            # Fingerprint authentication failed
            return jsonify({'error': 'Fingerprint authentication failed'}), 403
    except Exception as e:
        # Handle unexpected errors
        print(f"Error during decryption: {str(e)}")
        return jsonify({'error': 'An internal error occurred'}), 500

    

@app.route('/api/uploadandEncrypt', methods=['POST'])
def upload_and_encrypt():
    try:
        print("starting the process...")
        public_pem = request.form['public_pem']
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400
        
        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Pass the file object and public key to the `add_file_to_ipfs` function
        print("Herereeee")
        encrypted_cid = add_file_to_ipfs(file, public_pem)
        print("encrypted_cid: ", encrypted_cid)
        
        return jsonify({'encrypted_cid': encrypted_cid})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/decryptDownload', methods=['POST'])
def decrypt_and_download(): 
    print("Starting the process")
    try: 
        # private_pem = request.json['private_pem']
        ciphertext_hex = request.json.get('ciphertext')

        if not ciphertext_hex:
            return jsonify({'error': 'ciphertext is required'}), 400

        
        
        if fingerprint_scan(): 
            print("sending for generation")
            ciphertext = bytes.fromhex(ciphertext_hex)
            # hardcoding right now because can't fetch the raw data of a fingerrint from the native scanner
            public_key, private_key = generate_rsa_keypair('kjkszpj') 
            print("done with generation")
            public_pem, private_pem = keys_to_pem(public_key, private_key)
            

            # Fetch the file as a binary stream using the encrypted CID
            file_stream, mime_type = get_file_from_ipfs(ciphertext_hex, private_pem)
            print("file_stream: ", file_stream)
            print("mime_type: ", mime_type)
        
            # Return the file as a downloadable response
            return send_file(
                file_stream,
                as_attachment=True,
                download_name="retrieved_file",
                mimetype=mime_type
            )
        else:
            return jsonify({'error': 'Fingerprint authentication failed'}), 403
            
    except Exception as e: 
        print(f"Error during decryption and download: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5002, debug=True)
