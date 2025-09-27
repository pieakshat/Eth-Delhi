
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
  const [active, setActive] = useState<'generate' | 'encrypt' | 'decrypt' | 'upload' | 'download'>('generate')

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
    // if (!userInput.trim()) {
    //   showAlert('Please provide input for key generation', 'error')
    //   return
    // }

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
    if (!decryptCiphertext.trim()) {
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
    if (!downloadCiphertext.trim()) {
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center display-font font-black tracking-tight text-5xl md:text-6xl mb-10">BIOCRYPT</h1>
        <div className="min-h-[calc(100vh-12rem)] grid grid-cols-12 gap-8 items-center">
          <aside className="col-span-12 md:col-span-3 flex flex-col justify-center">
            <nav className="relative mx-auto w-[240px]">
              <ol className="space-y-5 text-sm">
                <li>
                  <button onClick={() => setActive('generate')} className="group flex items-center gap-3 w-full py-3">
                    <span className={`relative h-2 w-2 rounded-full transition ${active === 'generate' ? 'bg-white scale-110' : 'bg-gray-600 group-hover:bg-white'}`} />
                    <span className={`text-left ${active === 'generate' ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>Generate Keys</span>
                  </button>
                </li>
                <li className="relative">
                  <div className="absolute left-[5px] top-[-12px] bottom-0 w-px bg-gray-800" />
                  <button onClick={() => setActive('encrypt')} className="group flex items-center gap-3 w-full py-3">
                    <span className={`relative h-2 w-2 rounded-full transition ${active === 'encrypt' ? 'bg-white scale-110' : 'bg-gray-600 group-hover:bg-white'}`} />
                    <span className={`text-left ${active === 'encrypt' ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>Encrypt Message</span>
                  </button>
                </li>
                <li className="relative">
                  <div className="absolute left-[5px] top-[-12px] bottom-0 w-px bg-gray-800" />
                  <button onClick={() => setActive('decrypt')} className="group flex items-center gap-3 w-full py-3">
                    <span className={`relative h-2 w-2 rounded-full transition ${active === 'decrypt' ? 'bg-white scale-110' : 'bg-gray-600 group-hover:bg-white'}`} />
                    <span className={`text-left ${active === 'decrypt' ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>Decrypt Message</span>
                  </button>
                </li>
                <li className="relative">
                  <div className="absolute left-[5px] top-[-12px] bottom-0 w-px bg-gray-800" />
                  <button onClick={() => setActive('upload')} className="group flex items-center gap-3 w-full py-3">
                    <span className={`relative h-2 w-2 rounded-full transition ${active === 'upload' ? 'bg-white scale-110' : 'bg-gray-600 group-hover:bg-white'}`} />
                    <span className={`text-left ${active === 'upload' ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>Upload & Encrypt</span>
                  </button>
                </li>
                <li className="relative">
                  <div className="absolute left-[5px] top-[-12px] bottom-0 w-px bg-gray-800" />
                  <button onClick={() => setActive('download')} className="group flex items-center gap-3 w-full py-3">
                    <span className={`relative h-2 w-2 rounded-full transition ${active === 'download' ? 'bg-white scale-110' : 'bg-gray-600 group-hover:bg-white'}`} />
                    <span className={`text-left ${active === 'download' ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>Decrypt & Download</span>
                  </button>
                </li>
              </ol>
            </nav>
            {alert && (
              <div className="mt-6 text-xs border border-gray-800 rounded p-3 text-gray-200">
                {alert.message}
              </div>
            )}
          </aside>

          <div className="col-span-12 md:col-span-9 flex items-center justify-center">
            {active === 'generate' && (
              <section id="generate" className="border border-gray-800 rounded p-6 bg-secondary w-[720px] min-h-[420px] mx-auto flex flex-col">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Generate RSA Key Pair
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Generate a cryptographic key pair for secure encryption and decryption
                </p>
                <div className="space-y-4 flex-1">
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
                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={handleGenerateKeys}
                    disabled={loading === 'generating'}
                    className="bg-white text-black hover:bg-gray-200 px-6"
                  >
                    {loading === 'generating' ? 'Generating...' : 'Generate Keys'}
                  </Button>
                </div>
              </section>
            )}

            {active === 'encrypt' && (
              <section id="encrypt" className="border border-gray-800 rounded p-6 bg-secondary w-[720px] min-h-[420px] mx-auto flex flex-col">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Encrypt Message
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Encrypt a text message using the recipient's public key
                </p>
                <div className="space-y-4 flex-1">
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
                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={handleEncryptMessage}
                    disabled={loading === 'encrypting'}
                    className="bg-white text-black hover:bg-gray-200 px-6"
                  >
                    {loading === 'encrypting' ? 'Encrypting...' : 'Encrypt Message'}
                  </Button>
                </div>
              </section>
            )}

            {active === 'decrypt' && (
              <section id="decrypt" className="border border-gray-800 rounded p-6 bg-secondary w-[720px] min-h-[420px] mx-auto flex flex-col">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Decrypt Message
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Decrypt a text message using your Fingerprint
                </p>
                <div className="space-y-4 flex-1">
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
                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={handleDecryptMessage}
                    disabled={loading === 'decrypting'}
                    className="bg-white text-black hover:bg-gray-200 px-6"
                  >
                    {loading === 'decrypting' ? 'Decrypting...' : 'Decrypt Message'}
                  </Button>
                </div>
              </section>
            )}

            {active === 'upload' && (
              <section id="upload" className="border border-gray-800 rounded p-6 bg-secondary w-[720px] min-h-[420px] mx-auto flex flex-col">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Upload & Encrypt File
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Upload a file to IPFS and encrypt it with the recipient's public key
                </p>
                <div className="space-y-4 flex-1">
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
                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={handleUploadFile}
                    disabled={loading === 'uploading'}
                    className="bg-white text-black hover:bg-gray-200 px-6"
                  >
                    {loading === 'uploading' ? 'Uploading...' : 'Upload & Encrypt'}
                  </Button>
                </div>
              </section>
            )}

            {active === 'download' && (
              <section id="download" className="border border-gray-800 rounded p-6 bg-secondary w-[720px] min-h-[420px] mx-auto flex flex-col">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Decrypt & Download File
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Decrypt and download a file from IPFS using your private key
                </p>
                <div className="space-y-4 flex-1">
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
                </div>
                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={handleDownloadFile}
                    disabled={loading === 'downloading'}
                    className="bg-white text-black hover:bg-gray-200 px-6"
                  >
                    {loading === 'downloading' ? 'Downloading...' : 'Decrypt & Download'}
                  </Button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
