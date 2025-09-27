
'use client'

import { useState } from 'react'
// Stacked layout (no tabs)
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  generateKeys,
  encryptMessage,
  decryptMessage,
  uploadAndEncrypt,
  decryptAndDownload
} from '@/lib/actions'

export default function Dashboard() {
  const [loading, setLoading] = useState<string | null>(null)
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Generate Keys State
  const [userInput, setUserInput] = useState('')
  const [keys, setKeys] = useState<{ public: string; private: string } | null>(null)

  // Message Encryption State
  const [encryptPublicKey, setEncryptPublicKey] = useState('')
  const [messageToEncrypt, setMessageToEncrypt] = useState('')
  const [encryptedResult, setEncryptedResult] = useState('')

  // Message Decryption State
  const [decryptPrivateKey, setDecryptPrivateKey] = useState('')
  const [decryptCiphertext, setDecryptCiphertext] = useState('')
  const [decryptedResult, setDecryptedResult] = useState('')

  // File Upload State
  const [uploadPublicKey, setUploadPublicKey] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [encryptedCid, setEncryptedCid] = useState('')

  // File Download State
  const [downloadPrivateKey, setDownloadPrivateKey] = useState('')
  const [downloadCiphertext, setDownloadCiphertext] = useState('')

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleGenerateKeys = async () => {
    if (!userInput.trim()) {
      showAlert('Please provide input for key generation', 'error')
      return
    }

    setLoading('generating')
    try {
      const result = await generateKeys(userInput)
      setKeys({ public: result.public_key, private: result.private_key })
      showAlert('Keys generated successfully!', 'success')
    } catch (error) {
      showAlert('Failed to generate keys', 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleEncryptMessage = async () => {
    if (!encryptPublicKey.trim() || !messageToEncrypt.trim()) {
      showAlert('Please provide both public key and message', 'error')
      return
    }

    setLoading('encrypting')
    try {
      const result = await encryptMessage(encryptPublicKey, messageToEncrypt)
      setEncryptedResult(result.encrypted_message)
      showAlert('Message encrypted successfully!', 'success')
    } catch (error) {
      showAlert('Failed to encrypt message', 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleDecryptMessage = async () => {
    if (!decryptPrivateKey.trim() || !decryptCiphertext.trim()) {
      showAlert('Please provide both private key and ciphertext', 'error')
      return
    }

    setLoading('decrypting')
    try {
      const result = await decryptMessage(decryptPrivateKey, decryptCiphertext)
      setDecryptedResult(result.decrypted_message)
      showAlert('Message decrypted successfully!', 'success')
    } catch (error) {
      showAlert('Failed to decrypt message', 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleUploadFile = async () => {
    if (!uploadFile || !uploadPublicKey.trim()) {
      showAlert('Please provide both file and public key', 'error')
      return
    }

    setLoading('uploading')
    try {
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('public_pem', uploadPublicKey)

      const result = await uploadAndEncrypt(formData)
      setEncryptedCid(result.encrypted_cid)
      showAlert('File uploaded and encrypted successfully!', 'success')
    } catch (error) {
      showAlert('Failed to upload and encrypt file', 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleDownloadFile = async () => {
    if (!downloadPrivateKey.trim() || !downloadCiphertext.trim()) {
      showAlert('Please provide both private key and ciphertext', 'error')
      return
    }

    setLoading('downloading')
    try {
      const blob = await decryptAndDownload(downloadPrivateKey, downloadCiphertext)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'retrieved_file'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      showAlert('File decrypted and downloaded successfully!', 'success')
    } catch (error) {
      showAlert('Failed to decrypt and download file', 'error')
    } finally {
      setLoading(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    showAlert('Copied to clipboard!', 'success')
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
        <aside className="col-span-12 md:col-span-3">
          <h1 className="text-3xl font-semibold mb-6">BioCrypt</h1>
          <nav className="space-y-1 text-sm">
            <a href="#generate" className="block px-3 py-2 rounded border border-transparent hover:border-gray-700">Generate Keys</a>
            <a href="#encrypt" className="block px-3 py-2 rounded border border-transparent hover:border-gray-700">Encrypt Message</a>
            <a href="#decrypt" className="block px-3 py-2 rounded border border-transparent hover:border-gray-700">Decrypt Message</a>
            <a href="#upload" className="block px-3 py-2 rounded border border-transparent hover:border-gray-700">Upload & Encrypt</a>
            <a href="#download" className="block px-3 py-2 rounded border border-transparent hover:border-gray-700">Decrypt & Download</a>
          </nav>
          {alert && (
            <div className="mt-6 text-xs border border-gray-800 rounded p-3 text-gray-200">
              {alert.message}
            </div>
          )}
        </aside>

        <div className="col-span-12 md:col-span-9 space-y-8">
           <section id="generate" className="border border-gray-800 rounded p-6 bg-secondary">
             <h2 className="text-lg font-semibold text-white mb-2">
                Generate RSA Key Pair
              </h2>
             <p className="text-gray-400 text-sm mb-6">
                Generate a cryptographic key pair for secure encryption and decryption
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userInput" className="text-sm text-gray-200">Biometric Input</Label>
                  <Input
                    id="userInput"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter your biometric data or seed phrase"
                    className="border-gray-800 bg-black text-white placeholder:text-gray-500"
                  />
                </div>
                <Button
                  onClick={handleGenerateKeys}
                  disabled={loading === 'generating'}
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  {loading === 'generating' ? 'Generating...' : 'Generate Keys'}
                </Button>
                {keys && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-gray-200">Public Key</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(keys.public)}
                          className="text-xs border-gray-800 hover:bg-gray-900"
                        >
                          Copy
                        </Button>
                      </div>
                      <Textarea
                        value={keys.public}
                        readOnly
                        rows={6}
                        className="font-mono text-xs border-gray-800 bg-black text-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-gray-200">Private Key</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(keys.private)}
                          className="text-xs border-gray-800 hover:bg-gray-900"
                        >
                          Copy
                        </Button>
                      </div>
                      <Textarea
                        value={keys.private}
                        readOnly
                        rows={6}
                        className="font-mono text-xs border-gray-800 bg-black text-gray-200"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

           <section id="encrypt" className="border border-gray-800 rounded p-6 bg-secondary">
             <h2 className="text-lg font-semibold text-white mb-2">
                Encrypt Message
              </h2>
             <p className="text-gray-400 text-sm mb-6">
                Encrypt a text message using the recipient's public key
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="encryptPublicKey" className="text-sm text-gray-200">Recipient's Public Key</Label>
                  <Textarea
                    id="encryptPublicKey"
                    value={encryptPublicKey}
                    onChange={(e) => setEncryptPublicKey(e.target.value)}
                    placeholder="Enter the recipient's public key"
                    rows={4}
                    className="font-mono text-xs border-gray-800 bg-black text-gray-200 placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messageToEncrypt" className="text-sm text-gray-200">Message to Encrypt</Label>
                  <Textarea
                    id="messageToEncrypt"
                    value={messageToEncrypt}
                    onChange={(e) => setMessageToEncrypt(e.target.value)}
                    placeholder="Enter your message"
                    rows={3}
                    className="border-gray-800 bg-black text-gray-200 placeholder:text-gray-500"
                  />
                </div>
                <Button
                  onClick={handleEncryptMessage}
                  disabled={loading === 'encrypting'}
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  {loading === 'encrypting' ? 'Encrypting...' : 'Encrypt Message'}
                </Button>
                {encryptedResult && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-200">Encrypted Message</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(encryptedResult)}
                        className="text-xs border-gray-800 hover:bg-gray-900"
                      >
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={encryptedResult}
                      readOnly
                      rows={4}
                      className="font-mono text-xs border-gray-800 bg-black text-gray-200"
                    />
                  </div>
                )}
              </div>
            </section>

           <section id="decrypt" className="border border-gray-800 rounded p-6 bg-secondary">
             <h2 className="text-lg font-semibold text-white mb-2">
                Decrypt Message
              </h2>
             <p className="text-gray-400 text-sm mb-6">
                Decrypt a text message using your private key
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="decryptPrivateKey" className="text-sm text-gray-200">Your Private Key</Label>
                  <Textarea
                    id="decryptPrivateKey"
                    value={decryptPrivateKey}
                    onChange={(e) => setDecryptPrivateKey(e.target.value)}
                    placeholder="Enter your private key"
                    rows={4}
                    className="font-mono text-xs border-gray-800 bg-black text-gray-200 placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="decryptCiphertext" className="text-sm text-gray-200">Encrypted Message</Label>
                  <Textarea
                    id="decryptCiphertext"
                    value={decryptCiphertext}
                    onChange={(e) => setDecryptCiphertext(e.target.value)}
                    placeholder="Enter the encrypted message"
                    rows={3}
                    className="font-mono text-xs border-gray-800 bg-black text-gray-200 placeholder:text-gray-500"
                  />
                </div>
                <Button
                  onClick={handleDecryptMessage}
                  disabled={loading === 'decrypting'}
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  {loading === 'decrypting' ? 'Decrypting...' : 'Decrypt Message'}
                </Button>
                {decryptedResult && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-200">Decrypted Message</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(decryptedResult)}
                        className="text-xs border-gray-800 hover:bg-gray-900"
                      >
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={decryptedResult}
                      readOnly
                      rows={3}
                      className="border-gray-800 bg-black text-gray-200"
                    />
                  </div>
                )}
              </div>
            </section>

           <section id="upload" className="border border-gray-800 rounded p-6 bg-secondary">
             <h2 className="text-lg font-semibold text-white mb-2">
                Upload & Encrypt File
              </h2>
             <p className="text-gray-400 text-sm mb-6">
                Upload a file to IPFS and encrypt it with the recipient's public key
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="uploadPublicKey" className="text-sm text-gray-200">Recipient's Public Key</Label>
                  <Textarea
                    id="uploadPublicKey"
                    value={uploadPublicKey}
                    onChange={(e) => setUploadPublicKey(e.target.value)}
                    placeholder="Enter the recipient's public key"
                    rows={4}
                    className="font-mono text-xs border-gray-800 bg-black text-gray-200 placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uploadFile" className="text-sm text-gray-200">File to Upload</Label>
                  <Input
                    id="uploadFile"
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="border-gray-800 bg-black text-white file:text-white"
                  />
                </div>
                <Button
                  onClick={handleUploadFile}
                  disabled={loading === 'uploading'}
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  {loading === 'uploading' ? 'Uploading...' : 'Upload & Encrypt'}
                </Button>
                {encryptedCid && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-200">Encrypted CID</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(encryptedCid)}
                        className="text-xs border-gray-800 hover:bg-gray-900"
                      >
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={encryptedCid}
                      readOnly
                      rows={2}
                      className="font-mono text-xs border-gray-800 bg-black text-gray-200"
                    />
                  </div>
                )}
              </div>
            </section>

           <section id="download" className="border border-gray-800 rounded p-6 bg-secondary">
             <h2 className="text-lg font-semibold text-white mb-2">
                Decrypt & Download File
              </h2>
             <p className="text-gray-400 text-sm mb-6">
                Decrypt and download a file from IPFS using your private key
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="downloadPrivateKey" className="text-sm text-gray-200">Your Private Key</Label>
                  <Textarea
                    id="downloadPrivateKey"
                    value={downloadPrivateKey}
                    onChange={(e) => setDownloadPrivateKey(e.target.value)}
                    placeholder="Enter your private key"
                    rows={4}
                    className="font-mono text-xs border-gray-800 bg-black text-gray-200 placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="downloadCiphertext" className="text-sm text-gray-200">Encrypted CID</Label>
                  <Textarea
                    id="downloadCiphertext"
                    value={downloadCiphertext}
                    onChange={(e) => setDownloadCiphertext(e.target.value)}
                    placeholder="Enter the encrypted CID"
                    rows={2}
                    className="font-mono text-xs border-gray-800 bg-black text-gray-200 placeholder:text-gray-500"
                  />
                </div>
                <Button
                  onClick={handleDownloadFile}
                  disabled={loading === 'downloading'}
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  {loading === 'downloading' ? 'Downloading...' : 'Decrypt & Download'}
                </Button>
              </div>
            </section>
        </div>
      </div>
    </div>
  )
}
