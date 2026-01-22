"use client"

import { useEffect, useState } from 'react'
import ProtectedGate from '@/components/protected-gate'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Testing & Feedback | DonorConnect' }

export default function TestingPage() {
  const [entries, setEntries] = useState([])
  const [form, setForm] = useState({
    tester: '',
    role: '',
    scenario: '',
    rating: '3',
    notes: '',
    suggestions: '',
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dc_testing_entries')
      if (raw) setEntries(JSON.parse(raw))
    } catch {}
  }, [])

  const persist = (next) => {
    setEntries(next)
    try { localStorage.setItem('dc_testing_entries', JSON.stringify(next)) } catch {}
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      createdAt: new Date().toISOString(),
      ...form,
    }
    persist([entry, ...entries])
    setForm({ tester: '', role: '', scenario: '', rating: '3', notes: '', suggestions: '' })
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'donorconnect-testing-feedback.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    persist([])
  }

  return (
    <ProtectedGate>
      <div className="mx-auto max-w-4xl space-y-8 py-12 px-6">
        <h1 className="text-4xl font-bold text-white">Testing & Feedback</h1>
        <p className="text-gray-300">Use this page to capture user testing results and actionable feedback (CCC.1.4).</p>

        <form onSubmit={onSubmit} className="space-y-4 bg-slate-900/50 p-6 rounded-lg border border-purple-500/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300">Tester Name</label>
              <Input value={form.tester} onChange={(e) => setForm({ ...form, tester: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-300">Role</label>
              <Input placeholder="e.g., staff, donor, instructor" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-300">Scenario</label>
              <Input placeholder="e.g., add donor, log donation, build workflow" value={form.scenario} onChange={(e) => setForm({ ...form, scenario: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-300">Usability Rating (1–5)</label>
              <Input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-300">Observations / Notes</label>
            <Textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-300">Suggestions / Requested improvements</label>
            <Textarea rows={4} value={form.suggestions} onChange={(e) => setForm({ ...form, suggestions: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <Button type="submit">Save Entry</Button>
            <Button type="button" variant="outline" onClick={exportJson}>Export JSON</Button>
            <Button type="button" variant="destructive" onClick={clearAll}>Clear All</Button>
          </div>
        </form>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">Saved Entries</h2>
          {entries.length === 0 ? (
            <p className="text-gray-300">No entries yet. Record testing above.</p>
          ) : (
            <div className="space-y-3">
              {entries.map((e) => (
                <div key={e.id} className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/30">
                  <div className="text-sm text-gray-300">{new Date(e.createdAt).toLocaleString()}</div>
                  <div className="text-white font-medium">{e.tester} • {e.role}</div>
                  <div className="text-gray-300">Scenario: {e.scenario} • Rating: {e.rating}/5</div>
                  <div className="mt-2 text-gray-200">Notes: {e.notes || '—'}</div>
                  <div className="mt-1 text-gray-200">Suggestions: {e.suggestions || '—'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedGate>
  )
}
