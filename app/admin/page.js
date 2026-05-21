'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [tempPw, setTempPw] = useState('')
  const [resetId, setResetId] = useState(null)
  const [resetPw, setResetPw] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function getToken() { return localStorage.getItem('token') }

  useEffect(() => {
    const role = localStorage.getItem('role')
    if (role !== 'admin') { router.push('/login'); return }
    fetchUsers()
  }, [])

  async function fetchUsers() {
    const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${getToken()}` } })
    const data = await res.json()
    if (res.ok) setUsers(data.users)
  }

  async function createUser(e) {
    e.preventDefault()
    setLoading(true); setMsg(''); setError('')
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ name, email, temp_password: tempPw })
    })
    const data = await res.json()
    if (res.ok) { setMsg(`User ${data.user.email} created.`); setName(''); setEmail(''); setTempPw(''); fetchUsers() }
    else setError(data.error)
    setLoading(false)
  }

  async function resetPassword(e) {
    e.preventDefault()
    const res = await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ user_id: resetId, new_password: resetPw })
    })
    if (res.ok) { setMsg('Password reset successfully.'); setResetId(null); setResetPw('') }
  }

  function logout() { localStorage.clear(); router.push('/login') }

  const statusBadge = (u) => {
    if (u.passed === true) return <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">Passed {u.score}%</span>
    if (u.passed === false) return <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">Failed {u.score}%</span>
    return <span className="bg-gray-100 text-gray-400 text-xs font-semibold px-2 py-1 rounded-full">Not started</span>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#003865] text-white px-8 py-4 flex items-center justify-between">
        <div>
          <div className="font-bold text-lg">OTM Carriers Training</div>
          <div className="text-xs opacity-60">Admin Panel</div>
        </div>
        <button onClick={logout} className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition">Logout</button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Create user */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-lg font-bold text-[#003865] mb-6">Create New User</h2>
          <form onSubmit={createUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0078C8]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0078C8]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Temporary Password</label>
              <input value={tempPw} onChange={e => setTempPw(e.target.value)} required minLength={6}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0078C8]" />
            </div>
            <div className="md:col-span-3">
              <button type="submit" disabled={loading}
                className="bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50">
                {loading ? 'Creating...' : 'Create User'}
              </button>
              {msg && <span className="ml-4 text-green-600 text-sm">{msg}</span>}
              {error && <span className="ml-4 text-red-500 text-sm">{error}</span>}
            </div>
          </form>
        </div>

        {/* Users list */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-lg font-bold text-[#003865] mb-6">Users & Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wide border-b">
                  <th className="text-left pb-3">Name</th>
                  <th className="text-left pb-3">Email</th>
                  <th className="text-left pb-3">Status</th>
                  <th className="text-left pb-3">Language</th>
                  <th className="text-left pb-3">Completed</th>
                  <th className="text-left pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-[#003865]">{u.name}</td>
                    <td className="py-3 text-gray-500">{u.email}</td>
                    <td className="py-3">{statusBadge(u)}</td>
                    <td className="py-3 text-gray-400">{u.language ? u.language.toUpperCase() : '—'}</td>
                    <td className="py-3 text-gray-400 text-xs">{u.completed_at ? new Date(u.completed_at).toLocaleDateString() : '—'}</td>
                    <td className="py-3">
                      <button onClick={() => { setResetId(u.id); setResetPw('') }}
                        className="text-xs text-[#0078C8] hover:underline">Reset password</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reset password modal */}
        {resetId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
              <h3 className="text-lg font-bold text-[#003865] mb-4">Reset Password</h3>
              <form onSubmit={resetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">New Temporary Password</label>
                  <input value={resetPw} onChange={e => setResetPw(e.target.value)} required minLength={6}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0078C8]" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="bg-[#003865] text-white font-semibold px-5 py-2 rounded-lg text-sm">Reset</button>
                  <button type="button" onClick={() => setResetId(null)} className="border border-gray-200 px-5 py-2 rounded-lg text-sm">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
