'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('users')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [carrier, setCarrier] = useState('')
  const [role, setRole] = useState('user')
  const [resetId, setResetId] = useState(null)
  const [newCredentials, setNewCredentials] = useState(null)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function getToken() { return localStorage.getItem('token') }

  useEffect(() => {
    if (localStorage.getItem('role') !== 'admin') { router.push('/login'); return }
    fetchUsers()
  }, [])

  async function fetchUsers() {
    const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${getToken()}` } })
    const data = await res.json()
    if (res.ok) setUsers(data.users)
  }

  async function createUser(e) {
    e.preventDefault()
    setLoading(true); setMsg(''); setError(''); setNewCredentials(null)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, carrier, role })
    })
    const data = await res.json()
    if (res.ok) {
      setNewCredentials({ username: data.username, temp_password: data.temp_password, name: data.user.name })
      setFirstName(''); setLastName(''); setCarrier(''); setRole('user')
      fetchUsers()
    } else setError(data.error)
    setLoading(false)
  }

  async function resetPassword(userId) {
    const res = await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ user_id: userId })
    })
    const data = await res.json()
    if (res.ok) setResetId({ ...users.find(u => u.id === userId), temp_password: data.temp_password })
  }

  function logout() { localStorage.clear(); router.push('/login') }

  // Group users by carrier for ranking
  const carrierGroups = users.reduce((acc, u) => {
    const c = u.carrier || 'No carrier'
    if (!acc[c]) acc[c] = []
    acc[c].push(u)
    return acc
  }, {})

  const statusBadge = (u) => {
    if (u.passed === true) return <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">✓ Passed {u.score}%</span>
    if (u.passed === false) return <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">✗ Failed {u.score}%</span>
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

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-8">
        <div className="flex gap-6">
          {[['users','Users'],['ranking','Ranking']].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`py-4 text-sm font-semibold border-b-2 transition ${tab===key ? 'border-[#0078C8] text-[#003865]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {tab === 'users' && <>
          {/* Create user */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-lg font-bold text-[#003865] mb-6">Create New User</h2>
            <form onSubmit={createUser} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">First Name</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0078C8]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Last Name</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0078C8]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Carrier</label>
                <input value={carrier} onChange={e => setCarrier(e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0078C8]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Role</label>
                <select value={role} onChange={e => setRole(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0078C8]">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" disabled={loading}
                className="bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50">
                {loading ? 'Creating...' : 'Create'}
              </button>
            </form>
            {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}

            {/* New credentials box */}
            {newCredentials && (
              <div className="mt-6 bg-[#E8F3FB] border border-[#BDD9EF] rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wide text-[#003865] mb-3">✓ User created — send these credentials</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Name:</span> <strong>{newCredentials.name}</strong></div>
                  <div><span className="text-gray-500">Username:</span> <strong className="font-mono">{newCredentials.username}</strong></div>
                  <div className="col-span-2"><span className="text-gray-500">Temporary password:</span> <strong className="font-mono text-lg tracking-widest">{newCredentials.temp_password}</strong></div>
                </div>
                <button onClick={() => {
                  navigator.clipboard.writeText(`Username: ${newCredentials.username}\nPassword: ${newCredentials.temp_password}`)
                  setMsg('Copied!')
                  setTimeout(() => setMsg(''), 2000)
                }} className="mt-3 text-xs bg-[#003865] text-white px-4 py-2 rounded-lg hover:bg-[#0078C8] transition">
                  {msg || 'Copy credentials'}
                </button>
              </div>
            )}
          </div>

          {/* Users table */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-lg font-bold text-[#003865] mb-6">All Users ({users.filter(u => u.role !== 'admin').length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wide border-b">
                    <th className="text-left pb-3 pr-4">Name</th>
                    <th className="text-left pb-3 pr-4">Username</th>
                    <th className="text-left pb-3 pr-4">Carrier</th>
                    <th className="text-left pb-3 pr-4">Role</th>
                    <th className="text-left pb-3 pr-4">Quiz Status</th>
                    <th className="text-left pb-3 pr-4">Section</th>
                    <th className="text-left pb-3 pr-4">Completed</th>
                    <th className="text-left pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-[#003865]">{u.name}</td>
                      <td className="py-3 pr-4 text-gray-400 font-mono text-xs">{u.username}</td>
                      <td className="py-3 pr-4 text-gray-500">{u.carrier || '—'}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>{u.role}</span>
                      </td>
                      <td className="py-3 pr-4">{statusBadge(u)}</td>
                      <td className="py-3 pr-4 text-gray-400 text-xs">{u.section || '—'}</td>
                      <td className="py-3 pr-4 text-gray-400 text-xs">{u.completed_at ? new Date(u.completed_at).toLocaleDateString() : '—'}</td>
                      <td className="py-3">
                        <button onClick={() => resetPassword(u.id)}
                          className="text-xs text-[#0078C8] hover:underline">Reset pw</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>}

        {tab === 'ranking' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#003865]">Ranking by Carrier</h2>
            {Object.entries(carrierGroups).sort().map(([carrierName, members]) => {
              const completed = members.filter(u => u.score !== null)
              const passed = members.filter(u => u.passed === true)
              const avg = completed.length ? Math.round(completed.reduce((a, u) => a + u.score, 0) / completed.length) : null
              return (
                <div key={carrierName} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-[#003865] px-6 py-4 flex items-center justify-between">
                    <div className="text-white font-bold">{carrierName}</div>
                    <div className="flex gap-6 text-xs text-white/70">
                      <span>{members.length} participants</span>
                      <span>{passed.length} passed</span>
                      {avg !== null && <span className={`font-bold ${avg >= 90 ? 'text-green-300' : 'text-red-300'}`}>Avg: {avg}%</span>}
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wide border-b bg-gray-50">
                        <th className="text-left px-6 py-3">Name</th>
                        <th className="text-left px-6 py-3">Section</th>
                        <th className="text-left px-6 py-3">Score</th>
                        <th className="text-left px-6 py-3">Status</th>
                        <th className="text-left px-6 py-3">Language</th>
                        <th className="text-left px-6 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {members.sort((a,b) => (b.score||0)-(a.score||0)).map(u => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 font-medium text-[#003865]">{u.name}</td>
                          <td className="px-6 py-3 text-gray-400 text-xs">{u.section || '—'}</td>
                          <td className="px-6 py-3">
                            {u.score !== null ? <span className={`font-bold ${u.score >= 90 ? 'text-green-600' : 'text-red-500'}`}>{u.score}%</span> : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-6 py-3">{statusBadge(u)}</td>
                          <td className="px-6 py-3 text-gray-400 text-xs">{u.language ? u.language.toUpperCase() : '—'}</td>
                          <td className="px-6 py-3 text-gray-400 text-xs">{u.completed_at ? new Date(u.completed_at).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Reset password modal */}
      {resetId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-[#003865] mb-2">Password Reset</h3>
            <p className="text-gray-500 text-sm mb-4">Send these credentials to <strong>{resetId.name}</strong>:</p>
            <div className="bg-[#E8F3FB] rounded-xl p-4 mb-4">
              <div className="text-sm mb-1"><span className="text-gray-500">Username:</span> <strong className="font-mono">{resetId.username}</strong></div>
              <div className="text-sm"><span className="text-gray-500">New password:</span> <strong className="font-mono text-lg tracking-widest">{resetId.temp_password}</strong></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => {
                navigator.clipboard.writeText(`Username: ${resetId.username}\nPassword: ${resetId.temp_password}`)
              }} className="bg-[#003865] text-white font-semibold px-5 py-2 rounded-lg text-sm">Copy</button>
              <button onClick={() => setResetId(null)} className="border border-gray-200 px-5 py-2 rounded-lg text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
