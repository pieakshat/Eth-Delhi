export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="px-6 py-6">
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
        <section className="px-6 pt-16 pb-12">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="display-font font-black tracking-tight text-5xl md:text-6xl">Private, end‑to‑end encrypted sharing</h1>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
              Deterministic RSA from your biometric input. IPFS storage. Zero plaintext in transit.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <a href="/dashboard" className="px-5 py-3 bg-white text-black rounded hover:bg-gray-200">Open Dashboard</a>
              <a href="#how" className="px-5 py-3 border border-gray-700 rounded hover:bg-gray-900">How it works</a>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
              <span className="px-2 py-1 border border-gray-800 rounded">Local encryption</span>
              <span className="px-2 py-1 border border-gray-800 rounded">Open Source</span>
              <span className="px-2 py-1 border border-gray-800 rounded">No tracking</span>
              <span className="px-2 py-1 border border-gray-800 rounded">Self‑custodial keys</span>
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
