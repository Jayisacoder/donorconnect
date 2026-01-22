"use client"

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ProtectedGate({ children }) {
  const [authorized, setAuthorized] = useState(false)
  const [code, setCode] = useState('')

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem('lp_access') : null
      if (stored === 'lpuser1') setAuthorized(true)
    } catch {}
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code.trim() === 'lpuser1') {
      try {
        window.localStorage.setItem('lp_access', 'lpuser1')
      } catch {}
      setAuthorized(true)
    } else {
      alert('Invalid access code')
    }
  }

  if (!authorized) {
    return (
      <div className="mx-auto max-w-md py-12 px-6">
        <h1 className="text-2xl font-bold text-white">Restricted Page</h1>
        <p className="text-gray-300 mt-2">LP staff only. Enter your access code to continue.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <Input
            type="password"
            placeholder="Enter access code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button type="submit">Unlock</Button>
        </form>
      </div>
    )
  }

  return children
}
