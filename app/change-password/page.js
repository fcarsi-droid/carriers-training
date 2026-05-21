'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ChangePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    const token = localStorage.getItem('token')
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ password })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    const role = localStorage.getItem('role')
    if (role === 'admin') router.push('/admin')
    else router.push('/training')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003865] via-[#005B9A] to-[#0078C8]">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-2xl mb-2">🔐</div>
          <h1 className="text-2xl font-bold text-[#003865]">Set your password</h1>
          <p className="text-gray-400 text-sm mt-1">This is your first access. Please create a new password.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">New Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0078C8]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0078C8]" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#003865] hover:bg-[#0078C8] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50">
            {loading ? 'Saving...' : 'Set Password & Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
