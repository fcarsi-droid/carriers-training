import { query } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

function isAdmin(req) {
  const token = getTokenFromRequest(req)
  const user = verifyToken(token)
  return user && user.role === 'admin' ? user : null
}

export async function PATCH(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = params
  const { name, carrier, role } = await req.json()
  const first_name = name.split(' ')[0]
  const last_name = name.split(' ').slice(1).join(' ')
  await query(
    'UPDATE users SET name = $1, first_name = $2, last_name = $3, carrier = $4, role = $5 WHERE id = $6',
    [name, first_name, last_name, carrier, role, id]
  )
  return NextResponse.json({ success: true })
}

export async function DELETE(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = params
  await query('DELETE FROM quiz_results WHERE user_id = $1', [id])
  await query('DELETE FROM users WHERE id = $1', [id])
  return NextResponse.json({ success: true })
}
