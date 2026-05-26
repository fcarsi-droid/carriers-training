import { query } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

function getUser(req) {
  const token = getTokenFromRequest(req)
  return verifyToken(token)
}

export async function PATCH(req, { params }) {
  const user = getUser(req)
  if (!user || (user.role !== 'admin' && user.role !== 'master')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = params
  const { name, carrier, role } = await req.json()
  const first_name = name.split(' ')[0]
  const last_name = name.split(' ').slice(1).join(' ')
  // Only master can change roles
  if (role && user.role !== 'master') {
    await query('UPDATE users SET name = $1, first_name = $2, last_name = $3, carrier = $4 WHERE id = $5', [name, first_name, last_name, carrier, id])
  } else {
    await query('UPDATE users SET name = $1, first_name = $2, last_name = $3, carrier = $4, role = $5 WHERE id = $6', [name, first_name, last_name, carrier, role, id])
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(req, { params }) {
  const user = getUser(req)
  if (!user || user.role !== 'master') return NextResponse.json({ error: 'Forbidden — only master admins can delete users' }, { status: 403 })
  const { id } = params
  await query('DELETE FROM quiz_results WHERE user_id = $1', [id])
  await query('DELETE FROM users WHERE id = $1', [id])
  return NextResponse.json({ success: true })
}
