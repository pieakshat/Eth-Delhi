'use server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5002/api'

export interface GenerateKeysResponse {
  public_key: string
  private_key: string
}

export interface EncryptResponse {
  encrypted_message: string
}

export interface DecryptResponse {
  decrypted_message: string
}

export interface UploadEncryptResponse {
  encrypted_cid: string
}

export async function generateKeys(userInput: string): Promise<GenerateKeysResponse> {
  const response = await fetch(`${API_BASE_URL}/generate_keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_input: userInput }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate keys')
  }

  return response.json()
}

export async function encryptMessage(publicPem: string, message: string): Promise<EncryptResponse> {
  const response = await fetch(`${API_BASE_URL}/encrypt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ public_pem: publicPem, message }),
  })

  if (!response.ok) {
    throw new Error('Failed to encrypt message')
  }

  return response.json()
}

export async function decryptMessage(privatePem: string, ciphertext: string): Promise<DecryptResponse> {
  const response = await fetch(`${API_BASE_URL}/decrypt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ private_pem: privatePem, ciphertext }),
  })

  if (!response.ok) {
    throw new Error('Failed to decrypt message')
  }

  return response.json()
}

export async function uploadAndEncrypt(formData: FormData): Promise<UploadEncryptResponse> {
  const response = await fetch(`${API_BASE_URL}/uploadandEncrypt`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload and encrypt file')
  }

  return response.json()
}

export async function decryptAndDownload(privatePem: string, ciphertext: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/decryptDownload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ private_pem: privatePem, ciphertext }),
  })

  if (!response.ok) {
    throw new Error('Failed to decrypt and download file')
  }

  return response.blob()
}
