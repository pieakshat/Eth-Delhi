export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="px-6 py-6 sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-gray-900">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-xl font-semibold display-font tracking-tight">BIOCRYPT</div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-300">
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#security" className="hover:text-white">Security</a>
            <a href="/dashboard" className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200">Open Dashboard</a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="px-6 py-14 md:py-20 border-b border-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <div className="text-[11px] tracking-widest text-gray-400 uppercase">End‑to‑end encrypted</div>
              <h1 className="mt-3 display-font font-black tracking-tight text-4xl md:text-6xl leading-tight">
                Private sharing for files and messages
              </h1>
              <p className="mt-4 text-gray-400 max-w-xl mx-auto">
                Deterministic RSA from your biometric input. IPFS storage. Zero plaintext in transit.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <a href="/dashboard" className="px-5 py-2.5 bg-white text-black rounded hover:bg-gray-200">Open Dashboard</a>
                <a href="#how" className="px-5 py-2.5 border border-gray-700 rounded hover:bg-gray-900">How it works</a>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-500">
                <span className="px-2 py-1 border border-gray-800 rounded">Local encryption</span>
                <span className="px-2 py-1 border border-gray-800 rounded">Open Source</span>
                <span className="px-2 py-1 border border-gray-800 rounded">No tracking</span>
                <span className="px-2 py-1 border border-gray-800 rounded">Self‑custodial keys</span>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="px-6 py-12 border-t border-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg font-semibold mb-6">How it works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-800 rounded p-5">
                <div className="text-sm text-gray-400">Step 1</div>
                <div className="mt-1 font-medium">Generate keys</div>
                <p className="mt-2 text-sm text-gray-400">Create deterministic RSA keys from your biometric input. Never leaves device.</p>
              </div>
              <div className="border border-gray-800 rounded p-5">
                <div className="text-sm text-gray-400">Step 2</div>
                <div className="mt-1 font-medium">Encrypt & share</div>
                <p className="mt-2 text-sm text-gray-400">Encrypt message or IPFS CID with recipient’s public key and share ciphertext.</p>
              </div>
              <div className="border border-gray-800 rounded p-5">
                <div className="text-sm text-gray-400">Step 3</div>
                <div className="mt-1 font-medium">Decrypt & retrieve</div>
                <p className="mt-2 text-sm text-gray-400">Recipient decrypts locally and fetches file via IPFS using the CID.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem → Solution */}
        <section className="px-6 py-12 border-t border-gray-900">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">The problem</h3>
              <ul className="space-y-2 text-sm text-gray-400 list-disc list-inside">
                <li>Sensitive files sent over untrusted clouds</li>
                <li>Manual key exchange and operational friction</li>
                <li>Centralized storage and access logs</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Our approach</h3>
              <ul className="space-y-2 text-sm text-gray-400 list-disc list-inside">
                <li>Local, deterministic RSA from biometric input</li>
                <li>Client‑side encryption; transmit ciphertext only</li>
                <li>IPFS content addressing, no centralized files</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="px-6 py-12 border-t border-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg font-semibold mb-6">Capabilities</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="border border-gray-800 rounded p-5 text-sm">Encrypt messages</div>
              <div className="border border-gray-800 rounded p-5 text-sm">Upload & encrypt files (IPFS)</div>
              <div className="border border-gray-800 rounded p-5 text-sm">Decrypt & download</div>
              <div className="border border-gray-800 rounded p-5 text-sm">Clipboard‑safe CIDs</div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="px-6 py-12 border-t border-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg font-semibold mb-6">Security model</h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="border border-gray-800 rounded p-5">Biometric‑derived keys generated locally</div>
              <div className="border border-gray-800 rounded p-5">Client‑side RSA; ciphertext only transmitted</div>
              <div className="border border-gray-800 rounded p-5">IPFS storage with content addressing</div>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="px-6 py-12 border-t border-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg font-semibold mb-6">Try it now</h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <a href="/dashboard" className="border border-gray-800 rounded p-5 hover:bg-gray-900">Encrypt a message</a>
              <a href="/dashboard" className="border border-gray-800 rounded p-5 hover:bg-gray-900">Upload & encrypt a file</a>
              <a href="/dashboard" className="border border-gray-800 rounded p-5 hover:bg-gray-900">Decrypt & download</a>
            </div>
          </div>
        </section>

        {/* API (collapsed) */}
        <section className="px-6 py-12 border-t border-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg font-semibold mb-6">API endpoints</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <details className="border border-gray-800 rounded p-5">
                <summary className="cursor-pointer">POST /generate_keys</summary>
                <pre className="mt-3 text-xs text-gray-300 overflow-auto">{`{
  "user_input": "<biometric or seed>"
}`}</pre>
              </details>
              <details className="border border-gray-800 rounded p-5">
                <summary className="cursor-pointer">POST /encrypt</summary>
                <pre className="mt-3 text-xs text-gray-300 overflow-auto">{`{
  "public_pem": "<recipient public key>",
  "message": "<plaintext>"
}`}</pre>
              </details>
              <details className="border border-gray-800 rounded p-5">
                <summary className="cursor-pointer">POST /decrypt</summary>
                <pre className="mt-3 text-xs text-gray-300 overflow-auto">{`{
  "private_pem": "<your private key>",
  "ciphertext": "<ciphertext>"
}`}</pre>
              </details>
              <details className="border border-gray-800 rounded p-5">
                <summary className="cursor-pointer">POST /uploadandEncrypt</summary>
                <pre className="mt-3 text-xs text-gray-300 overflow-auto">multipart/form-data: file, public_pem</pre>
              </details>
              <details className="border border-gray-800 rounded p-5 md:col-span-2">
                <summary className="cursor-pointer">POST /decryptDownload</summary>
                <pre className="mt-3 text-xs text-gray-300 overflow-auto">{`{
  "private_pem": "<your private key>",
  "ciphertext": "<encrypted CID>"
}`}</pre>
              </details>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-12 border-t border-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg font-semibold mb-6">FAQ</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <details className="border border-gray-800 rounded p-5">
                <summary className="cursor-pointer">What data leaves my device?</summary>
                <p className="mt-3 text-gray-400">Only ciphertext and CIDs. Biometric input and keys never leave your device.</p>
              </details>
              <details className="border border-gray-800 rounded p-5">
                <summary className="cursor-pointer">What if I lose my private key?</summary>
                <p className="mt-3 text-gray-400">Keys are derived deterministically from your biometric input; re‑derive using the same input.</p>
              </details>
              <details className="border border-gray-800 rounded p-5">
                <summary className="cursor-pointer">Is biometric data ever stored?</summary>
                <p className="mt-3 text-gray-400">No. It is used locally to derive keys and is not persisted or transmitted.</p>
              </details>
              <details className="border border-gray-800 rounded p-5">
                <summary className="cursor-pointer">Do I need my own IPFS node?</summary>
                <p className="mt-3 text-gray-400">Recommended for production. For local dev, run <code>ipfs daemon</code> with the default API port.</p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 border-t border-gray-900">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl font-semibold">Ready to share securely?</h3>
            <div className="mt-6">
              <a href="/dashboard" className="px-6 py-3 bg-white text-black rounded hover:bg-gray-200">Open Dashboard</a>
            </div>
        </div>
        </section>
      </main>

      <footer className="px-6 py-10 border-t border-gray-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div>© {new Date().getFullYear()} BIOCRYPT</div>
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="hover:text-white">Dashboard</a>
            <a href="#security" className="hover:text-white">Security</a>
            <a href="#how" className="hover:text-white">How it works</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
