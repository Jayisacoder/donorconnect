export const metadata = { title: 'AI Policy & Safeguards | DonorConnect' }

export default function AIPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 py-12 px-6">
      <h1 className="text-4xl font-bold text-white">AI Policy & Safeguards</h1>
      <p className="text-lg text-gray-300">How DonorConnect uses AI responsibly to assist, not replace, nonprofit staff.</p>
      <div className="space-y-4 text-gray-200">
        <section>
          <h2 className="text-xl font-semibold text-white">Model & API</h2>
          <p>We call OpenAI GPT-4o-mini via server-side API route <code>/api/ai/summarize-donor</code>. Keys are stored in env and never exposed to the client.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">Data sent to AI</h2>
          <p>We send minimal, non-sensitive summary data: gift counts, totals, recency, risk level. We do not send raw PII like full addresses or phone numbers.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">Prompt craft</h2>
          <p>Prompts instruct the model to stay concise (60-80 words), avoid new facts, and emphasize actionability (risk + suggested follow-up).</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">Safety & controls</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Server-side calls only; UI shows errors instead of exposing traces.</li>
            <li>Organization scoping enforced before summarizing any donor.</li>
            <li>No training or logging of user content beyond transient request.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">Value to users</h2>
          <p>AI condenses donor history and risk so staff can personalize outreach faster, improving first-to-second gift conversion.</p>
        </section>
      </div>
    </div>
  )
}
