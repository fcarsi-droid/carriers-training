'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('name', data.name)
      localStorage.setItem('role', data.role)
      if (data.temp_password) router.push('/change-password')
      else if (data.role === 'admin' || data.role === 'master') router.push('/admin')
      else router.push('/training')
    } catch {
      setError('Connection error. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003865] via-[#005B9A] to-[#0078C8]">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block bg-[#003865] text-white text-xs font-bold tracking-widest px-4 py-2 rounded mb-4">OTM CARRIERS TRAINING</div>
          <h1 className="text-2xl font-bold text-[#003865]">Welcome</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to access your training</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
              placeholder="nome.sobrenome"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0078C8] focus:ring-2 focus:ring-[#E8F3FB]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0078C8] focus:ring-2 focus:ring-[#E8F3FB]" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#003865] hover:bg-[#0078C8] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
