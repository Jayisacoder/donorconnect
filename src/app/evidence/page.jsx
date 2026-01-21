export const metadata = { title: 'Evidence & Rubric | DonorConnect' }

export default function EvidencePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 py-12 px-6">
      <h1 className="text-4xl font-bold text-white">Evidence & Rubric</h1>
      <p className="text-lg text-gray-300">Links and notes to help assess the DonorConnect MVP.</p>
      <div className="space-y-6 text-gray-200">
        <section>
          <h2 className="text-xl font-semibold text-white">CCC.1.3 Evidence</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Source code: <a className="text-blue-600 underline" href="https://github.com/LaunchPadPhilly/donorconnect-bc2-Jayisacoder">GitHub repository</a></li>
            <li>Live app: <a className="text-blue-600 underline" href="https://donorconnect.vercel.app">Vercel deployment</a></li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">TS.6.2 Evidence</h2>
          <p>AI policy documented on <a className="text-blue-600 underline" href="/ai-policy">/ai-policy</a>. AI summaries run server-side with minimal donor data.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">TS.6.3 Evidence</h2>
          <p>Donor summary feature demonstrates responsible AI use: scoped data, concise outputs, and clear user control.</p>
        </section>
      </div>
    </div>
  )
}
