'use client'

import { useState } from 'react'
import { Key, MessageCircle, Upload, Download, Shield } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              BioCrypt
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Secure file sharing with biometric encryption using IPFS and RSA cryptography
          </p>
        </div>

        {alert && (
          <Alert className={`mb-6 ${alert.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <AlertDescription className={alert.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="generate" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Generate Keys
            </TabsTrigger>
            <TabsTrigger value="encrypt" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Encrypt Message
            </TabsTrigger>
            <TabsTrigger value="decrypt" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Decrypt Message
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload & Encrypt
            </TabsTrigger>
            <TabsTrigger value="download" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Decrypt & Download
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <Card className="bg-white/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Generate RSA Key Pair
                </CardTitle>
                <CardDescription>
                  Generate a cryptographic key pair for secure encryption and decryption
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="userInput">Biometric Input</Label>
                  <Input
                    id="userInput"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter your biometric data or seed phrase"
                  />
                </div>
                <Button
                  onClick={handleGenerateKeys}
                  disabled={loading === 'generating'}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  {loading === 'generating' ? 'Generating...' : 'Generate Keys'}
                </Button>
                {keys && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Public Key</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(keys.public)}
                        >
                          Copy
                        </Button>
                      </div>
                      <Textarea
                        value={keys.public}
                        readOnly
                        rows={6}
                        className="font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Private Key</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(keys.private)}
                        >
                          Copy
                        </Button>
                      </div>
                      <Textarea
                        value={keys.private}
                        readOnly
                        rows={6}
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="encrypt">
            <Card className="bg-white/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Encrypt Message
                </CardTitle>
                <CardDescription>
                  Encrypt a text message using the recipient's public key
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="encryptPublicKey">Recipient's Public Key</Label>
                  <Textarea
                    id="encryptPublicKey"
                    value={encryptPublicKey}
                    onChange={(e) => setEncryptPublicKey(e.target.value)}
                    placeholder="Enter the recipient's public key"
                    rows={4}
                    className="font-mono text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messageToEncrypt">Message to Encrypt</Label>
                  <Textarea
                    id="messageToEncrypt"
                    value={messageToEncrypt}
                    onChange={(e) => setMessageToEncrypt(e.target.value)}
                    placeholder="Enter your message"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleEncryptMessage}
                  disabled={loading === 'encrypting'}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  {loading === 'encrypting' ? 'Encrypting...' : 'Encrypt Message'}
                </Button>
                {encryptedResult && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Encrypted Message</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(encryptedResult)}
                      >
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={encryptedResult}
                      readOnly
                      rows={4}
                      className="font-mono text-xs"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decrypt">
            <Card className="bg-white/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Decrypt Message
                </CardTitle>
                <CardDescription>
                  Decrypt a text message using your private key
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="decryptPrivateKey">Your Private Key</Label>
                  <Textarea
                    id="decryptPrivateKey"
                    value={decryptPrivateKey}
                    onChange={(e) => setDecryptPrivateKey(e.target.value)}
                    placeholder="Enter your private key"
                    rows={4}
                    className="font-mono text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="decryptCiphertext">Encrypted Message</Label>
                  <Textarea
                    id="decryptCiphertext"
                    value={decryptCiphertext}
                    onChange={(e) => setDecryptCiphertext(e.target.value)}
                    placeholder="Enter the encrypted message"
                    rows={3}
                    className="font-mono text-xs"
                  />
                </div>
                <Button
                  onClick={handleDecryptMessage}
                  disabled={loading === 'decrypting'}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {loading === 'decrypting' ? 'Decrypting...' : 'Decrypt Message'}
                </Button>
                {decryptedResult && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Decrypted Message</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(decryptedResult)}
                      >
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={decryptedResult}
                      readOnly
                      rows={3}
                      className="bg-green-50"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card className="bg-white/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload & Encrypt File
                </CardTitle>
                <CardDescription>
                  Upload a file to IPFS and encrypt it with the recipient's public key
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="uploadPublicKey">Recipient's Public Key</Label>
                  <Textarea
                    id="uploadPublicKey"
                    value={uploadPublicKey}
                    onChange={(e) => setUploadPublicKey(e.target.value)}
                    placeholder="Enter the recipient's public key"
                    rows={4}
                    className="font-mono text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uploadFile">File to Upload</Label>
                  <Input
                    id="uploadFile"
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button
                  onClick={handleUploadFile}
                  disabled={loading === 'uploading'}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600"
                >
                  {loading === 'uploading' ? 'Uploading...' : 'Upload & Encrypt'}
                </Button>
                {encryptedCid && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Encrypted CID</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(encryptedCid)}
                      >
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={encryptedCid}
                      readOnly
                      rows={2}
                      className="font-mono text-xs bg-orange-50"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="download">
            <Card className="bg-white/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Decrypt & Download File
                </CardTitle>
                <CardDescription>
                  Decrypt and download a file from IPFS using your private key
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="downloadPrivateKey">Your Private Key</Label>
                  <Textarea
                    id="downloadPrivateKey"
                    value={downloadPrivateKey}
                    onChange={(e) => setDownloadPrivateKey(e.target.value)}
                    placeholder="Enter your private key"
                    rows={4}
                    className="font-mono text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="downloadCiphertext">Encrypted CID</Label>
                  <Textarea
                    id="downloadCiphertext"
                    value={downloadCiphertext}
                    onChange={(e) => setDownloadCiphertext(e.target.value)}
                    placeholder="Enter the encrypted CID"
                    rows={2}
                    className="font-mono text-xs"
                  />
                </div>
                <Button
                  onClick={handleDownloadFile}
                  disabled={loading === 'downloading'}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600"
                >
                  {loading === 'downloading' ? 'Downloading...' : 'Decrypt & Download'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
