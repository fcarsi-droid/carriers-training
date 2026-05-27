'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const SECTIONS = { basic: 'OTM Basic', 'fault-codes': 'Fault Codes', 'freight-settlement': 'Freight Settlement' }

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard')
  const [data, setData] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [myRole, setMyRole] = useState('admin')
  const isMaster = myRole === 'master'
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [carrier, setCarrier] = useState('')
  const [role, setRole] = useState('user')
  const [newCredentials, setNewCredentials] = useState(null)
  const [createError, setCreateError] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [deleteUser, setDeleteUser] = useState(null)
  const [resetUser, setResetUser] = useState(null)
  const [expandedUser, setExpandedUser] = useState(null)
  const [msg, setMsg] = useState('')
  const router = useRouter()
  const canvasRef = useRef(null)
  const canvas2Ref = useRef(null)

  function getToken() {
    try {
      const ls = localStorage.getItem('token')
      if (ls && ls !== 'null' && ls !== 'undefined') return ls
    } catch(e) {}
    try {
      const ss = sessionStorage.getItem('token')
      if (ss && ss !== 'null' && ss !== 'undefined') return ss
    } catch(e) {}
    return null
  }

  function authHeaders() {
    const token = getToken()
    return token
      ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      : { 'Content-Type': 'application/json' }
  }

  function authFetch(url, opts = {}) {
    const token = getToken()
    return fetch(url, {
      ...opts,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opts.headers || {})
      }
    })
  }

  useEffect(() => {
    function getCookie(name) {
      const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'))
      return match ? decodeURIComponent(match[1]) : null
    }
    const role = localStorage.getItem('role') || getCookie('userRole')
    if (role !== 'admin' && role !== 'master') { router.push('/login'); return }
    setMyRole(role || 'admin')
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    const [rep, usr] = await Promise.all([
      authFetch('/api/admin/reports').then(r => r.json()),
      authFetch('/api/admin/users').then(r => r.json())
    ])
    setData(rep)
    setUsers(usr.users || [])
    setLoading(false)
  }

  useEffect(() => {
    if (data && tab === 'dashboard') {
      drawCarrierChart()
      drawWeeklyChart()
    }
  }, [data, tab])

  function drawCarrierChart() {
    const canvas = canvasRef.current
    if (!canvas || !data?.byCarrier?.length) return
    const ctx = canvas.getContext('2d')
    const carriers = data.byCarrier.filter(c => c.carrier).slice(0, 8)
    const W = canvas.width, H = canvas.height
    const pad = { top: 20, right: 20, bottom: 60, left: 50 }
    ctx.clearRect(0, 0, W, H)
    const barW = Math.min(40, (W - pad.left - pad.right) / (carriers.length * 2))
    const maxVal = 100
    carriers.forEach((c, i) => {
      const x = pad.left + i * ((W - pad.left - pad.right) / carriers.length) + (W - pad.left - pad.right) / carriers.length / 2 - barW / 2
      const barH = ((c.avg_score || 0) / maxVal) * (H - pad.top - pad.bottom)
      const y = H - pad.bottom - barH
      const color = (c.avg_score || 0) >= 90 ? '#1A7F4B' : (c.avg_score || 0) >= 70 ? '#F59E0B' : '#C0392B'
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0])
      ctx.fill()
      ctx.fillStyle = '#003865'
      ctx.font = 'bold 11px DM Sans, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${Math.round(c.avg_score || 0)}%`, x + barW / 2, y - 5)
      ctx.fillStyle = '#8A9BB0'
      ctx.font = '10px DM Sans, sans-serif'
      const label = (c.carrier || 'N/A').substring(0, 10)
      ctx.fillText(label, x + barW / 2, H - pad.bottom + 14)
      ctx.fillText(`${c.passed}/${c.total}`, x + barW / 2, H - pad.bottom + 26)
    })
    // Y axis
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = 1
    ;[0, 25, 50, 75, 100].forEach(v => {
      const y = H - pad.bottom - (v / maxVal) * (H - pad.top - pad.bottom)
      ctx.beginPath(); ctx.moveTo(pad.left - 5, y); ctx.lineTo(W - pad.right, y); ctx.stroke()
      ctx.fillStyle = '#8A9BB0'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right'
      ctx.fillText(`${v}%`, pad.left - 8, y + 3)
    })
  }

  function drawWeeklyChart() {
    const canvas = canvas2Ref.current
    if (!canvas || !data?.weekly?.length) return
    const ctx = canvas.getContext('2d')
    const weeks = data.weekly
    const W = canvas.width, H = canvas.height
    const pad = { top: 20, right: 20, bottom: 40, left: 40 }
    ctx.clearRect(0, 0, W, H)
    const maxVal = Math.max(...weeks.map(w => w.completions), 1)
    const pts = weeks.map((w, i) => ({
      x: pad.left + (i / Math.max(weeks.length - 1, 1)) * (W - pad.left - pad.right),
      y: H - pad.bottom - (w.completions / maxVal) * (H - pad.top - pad.bottom),
      yPassed: H - pad.bottom - (w.passed / maxVal) * (H - pad.top - pad.bottom),
      w
    }))
    // Grid
    ctx.strokeStyle = '#E5E7EB'; ctx.lineWidth = 1
    ;[0, 0.25, 0.5, 0.75, 1].forEach(v => {
      const y = H - pad.bottom - v * (H - pad.top - pad.bottom)
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke()
      ctx.fillStyle = '#8A9BB0'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right'
      ctx.fillText(Math.round(v * maxVal), pad.left - 5, y + 3)
    })
    // Total line
    ctx.strokeStyle = '#0078C8'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'
    ctx.beginPath(); pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)); ctx.stroke()
    // Passed line
    ctx.strokeStyle = '#1A7F4B'; ctx.lineWidth = 2; ctx.setLineDash([5, 3])
    ctx.beginPath(); pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.yPassed) : ctx.lineTo(p.x, p.yPassed)); ctx.stroke()
    ctx.setLineDash([])
    // Dots
    pts.forEach(p => {
      ctx.fillStyle = '#0078C8'; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#003865'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'
      ctx.fillText(p.w.completions, p.x, p.y - 8)
      const d = new Date(p.w.week)
      ctx.fillStyle = '#8A9BB0'; ctx.font = '9px sans-serif'
      ctx.fillText(`${d.getMonth()+1}/${d.getDate()}`, p.x, H - pad.bottom + 12)
    })
    // Legend
    ctx.fillStyle = '#0078C8'; ctx.fillRect(W - 120, 8, 12, 3)
    ctx.fillStyle = '#003865'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('Total', W - 104, 13)
    ctx.fillStyle = '#1A7F4B'; ctx.fillRect(W - 120, 20, 12, 3)
    ctx.fillText('Passed', W - 104, 25)
  }

  async function createUser(e) {
    e.preventDefault()
    setCreateLoading(true); setCreateError(''); setNewCredentials(null)
    const res = await authFetch('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ first_name: firstName, last_name: lastName, carrier, role })
    })
    const d = await res.json()
    if (res.ok) {
      setNewCredentials({ username: d.username, temp_password: d.temp_password, name: d.user.name })
      setFirstName(''); setLastName(''); setCarrier(''); setRole('user')
      fetchAll()
    } else setCreateError(d.error)
    setCreateLoading(false)
  }

  async function saveEdit(e) {
    e.preventDefault()
    await authFetch(`/api/admin/users/${editUser.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: editUser.name, carrier: editUser.carrier, role: editUser.role })
    })
    setEditUser(null); setMsg('User updated.'); fetchAll()
    setTimeout(() => setMsg(''), 3000)
  }

  async function confirmDelete() {
    await authFetch(`/api/admin/users/${deleteUser.id}`, { method: 'DELETE' })
    setDeleteUser(null); setMsg('User deleted.'); fetchAll()
    setTimeout(() => setMsg(''), 3000)
  }

  async function resetPassword() {
    const res = await authFetch('/api/admin/reset-password', {
      method: 'POST',
      body: JSON.stringify({ user_id: resetUser.id })
    })
    const d = await res.json()
    setResetUser({ ...resetUser, temp_password: d.temp_password, done: true })
    fetchAll()
  }

  async function exportXLS() {
    const XLSX = await import('xlsx')
    const utils = XLSX.utils
    const writeFile = XLSX.writeFile
    const rows = [['Name','Username','Carrier','Role','Section','Score','Passed','Language','Date']]
    users.forEach(u => {
      if (!u.attempts || u.attempts.length === 0) {
        rows.push([u.name, u.username, u.carrier || '', u.role, '', '', 'Not started', '', ''])
      } else {
        u.attempts.forEach(a => {
          rows.push([u.name, u.username, u.carrier || '', u.role, SECTIONS[a.section] || a.section, a.score+'%', a.passed ? 'Yes' : 'No', (a.language||'').toUpperCase(), a.completed_at ? new Date(a.completed_at).toLocaleDateString() : ''])
        })
      }
    })
    const ws = utils.aoa_to_sheet(rows)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Training Results')
    writeFile(wb, 'otm_training_report.xlsx')
  }

  async function exportPDF() {
    const w = window.open('', '_blank')
    const o = data?.overall || {}
    const carrierRows = (data?.byCarrier || []).map(c => `
      <tr>
        <td>${c.carrier || '—'}</td>
        <td>${c.total}</td>
        <td>${c.passed}</td>
        <td>${c.failed}</td>
        <td>${c.not_started}</td>
        <td style="color:${(c.avg_score||0)>=90?'#1A7F4B':'#C0392B'};font-weight:bold">${c.avg_score ? Math.round(c.avg_score)+'%' : '—'}</td>
      </tr>`).join('')
    const userRows = users.map(u => {
      const lastAttempt = u.attempts?.[0]
      return `<tr>
        <td>${u.name}</td>
        <td>${u.carrier || '—'}</td>
        <td>${lastAttempt ? (SECTIONS[lastAttempt.section]||lastAttempt.section) : '—'}</td>
        <td style="color:${lastAttempt?.passed?'#1A7F4B':lastAttempt?'#C0392B':'#8A9BB0'};font-weight:bold">
          ${lastAttempt ? lastAttempt.score+'%' : 'Not started'}
        </td>
        <td>${lastAttempt?.completed_at ? new Date(lastAttempt.completed_at).toLocaleDateString() : '—'}</td>
      </tr>`}).join('')
    w.document.write(`<html><head><meta charset="UTF-8"><title>OTM Training Report</title>
    <style>
      body{font-family:Arial,sans-serif;color:#1a1a2e;margin:40px;font-size:12px}
      h1{color:#003865;font-size:20px;border-bottom:2px solid #003865;padding-bottom:8px}
      h2{color:#003865;font-size:14px;margin-top:28px;margin-bottom:8px}
      .cards{display:flex;gap:16px;margin:16px 0}
      .card{background:#E8F3FB;border-radius:8px;padding:12px 20px;text-align:center;flex:1}
      .card-num{font-size:28px;font-weight:bold;color:#003865}
      .card-label{font-size:10px;color:#8A9BB0;text-transform:uppercase;letter-spacing:1px}
      table{width:100%;border-collapse:collapse;margin-top:8px}
      th{background:#003865;color:white;padding:8px;text-align:left;font-size:11px}
      td{padding:7px 8px;border-bottom:1px solid #E5E7EB;font-size:11px}
      tr:nth-child(even){background:#F5F8FB}
      .footer{margin-top:32px;color:#8A9BB0;font-size:10px}
    </style></head><body>
    <h1>OTM Carriers Training — Management Report</h1>
    <p style="color:#8A9BB0;font-size:11px">Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
    <div class="cards">
      <div class="card"><div class="card-num">${o.total_users||0}</div><div class="card-label">Total Users</div></div>
      <div class="card"><div class="card-num">${o.passed||0}</div><div class="card-label">Passed</div></div>
      <div class="card"><div class="card-num">${o.failed||0}</div><div class="card-label">Failed</div></div>
      <div class="card"><div class="card-num">${o.not_started||0}</div><div class="card-label">Not Started</div></div>
    </div>
    <h2>Results by Carrier</h2>
    <table><thead><tr><th>Carrier</th><th>Total</th><th>Passed</th><th>Failed</th><th>Not Started</th><th>Avg Score</th></tr></thead>
    <tbody>${carrierRows}</tbody></table>
    <h2>Individual Results</h2>
    <table><thead><tr><th>Name</th><th>Carrier</th><th>Last Section</th><th>Last Score</th><th>Date</th></tr></thead>
    <tbody>${userRows}</tbody></table>
    <div class="footer">OTM Carriers Training Platform</div>
    </body></html>`)
    w.document.close()
    setTimeout(() => w.print(), 500)
  }

  function logout() {
    localStorage.clear()
    document.cookie = 'token=; path=/; max-age=0'
    document.cookie = 'userRole=; path=/; max-age=0'
    document.cookie = 'userName=; path=/; max-age=0'
    router.push('/login')
  }

  const statusBadge = (u) => {
    const last = u.attempts?.[0]
    if (!last) return <span className="bg-gray-100 text-gray-400 text-xs font-semibold px-2 py-1 rounded-full">Not started</span>
    if (last.passed) return <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">✓ {last.score}%</span>
    return <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">✗ {last.score}%</span>
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-[#003865] text-sm font-medium animate-pulse">Loading dashboard...</div>
    </div>
  )

  const o = data?.overall || {}
  const passRate = o.total_users > 0 ? Math.round((o.passed / o.total_users) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#003865] text-white px-8 h-16 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div><div className="font-bold text-lg">OTM Carriers Training</div><div className="text-xs opacity-60">Admin Panel</div></div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-xs bg-green-500/20 border border-green-400/30 text-green-300 px-3 py-1 rounded-full">{msg}</span>}
          <button onClick={logout} className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition">Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-8">
        <div className="flex gap-1">
          {[['dashboard','📊 Dashboard'],['users','👥 Users'],['ranking','🏆 Ranking']].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`py-4 px-4 text-sm font-semibold border-b-2 transition ${tab===key ? 'border-[#0078C8] text-[#003865]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: o.total_users || 0, color: 'text-[#003865]', bg: 'bg-[#E8F3FB]' },
                { label: 'Passed', value: o.passed || 0, color: 'text-green-700', bg: 'bg-green-50' },
                { label: 'Failed', value: o.failed || 0, color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'Not Started', value: o.not_started || 0, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map(c => (
                <div key={c.label} className={`${c.bg} rounded-2xl p-5 text-center`}>
                  <div className={`text-4xl font-bold ${c.color}`}>{c.value}</div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mt-1">{c.label}</div>
                </div>
              ))}
            </div>

            {/* Pass rate bar */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#003865]">Overall Pass Rate</h3>
                <span className={`text-2xl font-bold ${passRate >= 90 ? 'text-green-600' : passRate >= 70 ? 'text-amber-500' : 'text-red-500'}`}>{passRate}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all duration-700 ${passRate >= 90 ? 'bg-green-500' : passRate >= 70 ? 'bg-amber-400' : 'bg-red-500'}`} style={{width: passRate+'%'}}></div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-[#003865] mb-4">Avg Score by Carrier</h3>
                <canvas ref={canvasRef} width={480} height={220} className="w-full"></canvas>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-[#003865] mb-4">Weekly Completions</h3>
                <canvas ref={canvas2Ref} width={480} height={220} className="w-full"></canvas>
              </div>
            </div>

            {/* Export buttons */}
            <div className="flex gap-3">
              <button onClick={exportPDF} className="bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition flex items-center gap-2">
                📄 Export PDF
              </button>
              <button onClick={exportXLS} className="bg-green-700 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition flex items-center gap-2">
                📊 Export XLS
              </button>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div className="space-y-6">
            {/* Create user */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-lg font-bold text-[#003865] mb-6">Create New User</h2>
              <form onSubmit={createUser} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                {[['First Name', firstName, setFirstName], ['Last Name', lastName, setLastName], ['Carrier', carrier, setCarrier]].map(([label, val, setter]) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
                    <input value={val} onChange={e => setter(e.target.value)} required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0078C8]" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Role</label>
                  <select value={role} onChange={e => setRole(e.target.value)} disabled={!isMaster}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0078C8] disabled:bg-gray-50 disabled:text-gray-400">
                    <option value="user">User</option>
                    {isMaster && <option value="admin">Admin</option>}
                    {isMaster && <option value="master">Master</option>}
                  </select>
                </div>
                <button type="submit" disabled={createLoading}
                  className="bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50">
                  {createLoading ? 'Creating...' : 'Create'}
                </button>
              </form>
              {createError && <div className="mt-3 text-red-500 text-sm">{createError}</div>}
              {newCredentials && (
                <div className="mt-5 bg-[#E8F3FB] border border-[#BDD9EF] rounded-xl p-5">
                  <div className="text-xs font-bold uppercase tracking-wide text-[#003865] mb-3">✓ User created — send these credentials</div>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div><span className="text-gray-500">Name:</span> <strong>{newCredentials.name}</strong></div>
                    <div><span className="text-gray-500">Username:</span> <strong className="font-mono">{newCredentials.username}</strong></div>
                    <div className="col-span-2"><span className="text-gray-500">Temp password:</span> <strong className="font-mono text-lg tracking-widest">{newCredentials.temp_password}</strong></div>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(`Username: ${newCredentials.username}\nPassword: ${newCredentials.temp_password}`); setMsg('Copied!'); setTimeout(() => setMsg(''), 2000) }}
                    className="text-xs bg-[#003865] text-white px-4 py-2 rounded-lg hover:bg-[#0078C8] transition">Copy credentials</button>
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
                      {['Name','Username','Carrier','Role','Status','Attempts','Actions'].map(h => (
                        <th key={h} className="text-left pb-3 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(data?.users || users).map(u => (
                      <>
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="py-3 pr-4 font-medium text-[#003865]">{u.name}</td>
                          <td className="py-3 pr-4 text-gray-400 font-mono text-xs">{u.username}</td>
                          <td className="py-3 pr-4 text-gray-500">{u.carrier || '—'}</td>
                          <td className="py-3 pr-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>{u.role}</span>
                          </td>
                          <td className="py-3 pr-4">{statusBadge(u)}</td>
                          <td className="py-3 pr-4">
                            {u.attempts?.length > 0 && (
                              <button onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                                className="text-xs text-[#0078C8] hover:underline">
                                {u.attempts.length} attempt{u.attempts.length > 1 ? 's' : ''} {expandedUser === u.id ? '▲' : '▼'}
                              </button>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="flex gap-3">
                              <button onClick={() => setEditUser({...u})} className="text-xs text-[#0078C8] hover:underline">Edit</button>
                              <button onClick={() => setResetUser(u)} className="text-xs text-amber-600 hover:underline">Reset pw</button>
                              {isMaster && <button onClick={() => setDeleteUser(u)} className="text-xs text-red-500 hover:underline">Delete</button>}
                            </div>
                          </td>
                        </tr>
                        {expandedUser === u.id && u.attempts?.map((a, i) => (
                          <tr key={i} className="bg-[#E8F3FB]/50">
                            <td colSpan={2} className="py-2 pl-6 text-xs text-gray-500">{SECTIONS[a.section] || a.section}</td>
                            <td className="py-2 text-xs text-gray-500">{(a.language||'').toUpperCase()}</td>
                            <td colSpan={2} className="py-2">
                              <span className={`text-xs font-semibold ${a.passed ? 'text-green-600' : 'text-red-500'}`}>{a.score}% — {a.passed ? 'Passed' : 'Failed'}</span>
                            </td>
                            <td className="py-2 text-xs text-gray-400">{a.completed_at ? new Date(a.completed_at).toLocaleDateString() : '—'}</td>
                            <td></td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* RANKING TAB */}
        {tab === 'ranking' && (
          <div className="space-y-6">
            {(data?.byCarrier || []).filter(c => c.carrier && c.carrier !== 'No carrier').map(c => {
              const members = (data?.users || []).filter(u => u.carrier === c.carrier)
              return (
                <div key={c.carrier} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-[#003865] px-6 py-4 flex items-center justify-between">
                    <div className="text-white font-bold">{c.carrier}</div>
                    <div className="flex gap-6 text-xs text-white/70">
                      <span>{c.total} participants</span>
                      <span className="text-green-300">{c.passed} passed</span>
                      <span className="text-red-300">{c.failed} failed</span>
                      {c.avg_score && <span className={`font-bold ${c.avg_score >= 90 ? 'text-green-300' : 'text-red-300'}`}>Avg: {Math.round(c.avg_score)}%</span>}
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wide border-b bg-gray-50">
                        {['#','Name','Section','Score','Status','Language','Date'].map(h => (
                          <th key={h} className="text-left px-5 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {members.sort((a,b) => {
                        const sa = a.attempts?.[0]?.score || 0
                        const sb = b.attempts?.[0]?.score || 0
                        return sb - sa
                      }).map((u, i) => {
                        const last = u.attempts?.[0]
                        return (
                          <tr key={u.id} className="hover:bg-gray-50">
                            <td className="px-5 py-3 text-gray-400 text-xs font-bold">{i+1}</td>
                            <td className="px-5 py-3 font-medium text-[#003865]">{u.name}</td>
                            <td className="px-5 py-3 text-gray-400 text-xs">{last ? (SECTIONS[last.section]||last.section) : '—'}</td>
                            <td className="px-5 py-3">
                              {last ? <span className={`font-bold ${last.score >= 90 ? 'text-green-600' : 'text-red-500'}`}>{last.score}%</span> : <span className="text-gray-300">—</span>}
                            </td>
                            <td className="px-5 py-3">
                              {last
                                ? last.passed
                                  ? <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">✓ Passed</span>
                                  : <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">✗ Failed</span>
                                : <span className="bg-gray-100 text-gray-400 text-xs font-semibold px-2 py-1 rounded-full">Not started</span>}
                            </td>
                            <td className="px-5 py-3 text-gray-400 text-xs">{last?.language?.toUpperCase() || '—'}</td>
                            <td className="px-5 py-3 text-gray-400 text-xs">{last?.completed_at ? new Date(last.completed_at).toLocaleDateString() : '—'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-[#003865] mb-5">Edit User</h3>
            <form onSubmit={saveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Full Name</label>
                <input value={editUser.name} onChange={e => setEditUser({...editUser, name: e.target.value})} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0078C8]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Carrier</label>
                <input value={editUser.carrier || ''} onChange={e => setEditUser({...editUser, carrier: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0078C8]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Role</label>
                <select value={editUser.role} onChange={e => setEditUser({...editUser, role: e.target.value})} disabled={!isMaster}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0078C8] disabled:bg-gray-50 disabled:text-gray-400">
                  <option value="user">User</option>
                  {isMaster && <option value="admin">Admin</option>}
                  {isMaster && <option value="master">Master</option>}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-[#003865] text-white font-semibold px-5 py-2 rounded-lg text-sm hover:bg-[#0078C8] transition">Save</button>
                <button type="button" onClick={() => setEditUser(null)} className="border border-gray-200 px-5 py-2 rounded-lg text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold text-[#003865] mb-2">Delete User</h3>
            <p className="text-gray-500 text-sm mb-5">Are you sure you want to delete <strong>{deleteUser.name}</strong>? This will also delete all their quiz results and cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={confirmDelete} className="bg-red-500 text-white font-semibold px-5 py-2 rounded-lg text-sm hover:bg-red-600 transition">Delete</button>
              <button onClick={() => setDeleteUser(null)} className="border border-gray-200 px-5 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-[#003865] mb-2">Reset Password</h3>
            {!resetUser.done ? (
              <>
                <p className="text-gray-500 text-sm mb-5">Generate a new temporary password for <strong>{resetUser.name}</strong>?</p>
                <div className="flex gap-3">
                  <button onClick={resetPassword} className="bg-[#003865] text-white font-semibold px-5 py-2 rounded-lg text-sm hover:bg-[#0078C8] transition">Generate</button>
                  <button onClick={() => setResetUser(null)} className="border border-gray-200 px-5 py-2 rounded-lg text-sm">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-[#E8F3FB] rounded-xl p-4 mb-4">
                  <div className="text-sm mb-1"><span className="text-gray-500">Username:</span> <strong className="font-mono">{resetUser.username}</strong></div>
                  <div className="text-sm"><span className="text-gray-500">New password:</span> <strong className="font-mono text-lg tracking-widest">{resetUser.temp_password}</strong></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { navigator.clipboard.writeText(`Username: ${resetUser.username}\nPassword: ${resetUser.temp_password}`) }} className="bg-[#003865] text-white font-semibold px-5 py-2 rounded-lg text-sm">Copy</button>
                  <button onClick={() => setResetUser(null)} className="border border-gray-200 px-5 py-2 rounded-lg text-sm">Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
