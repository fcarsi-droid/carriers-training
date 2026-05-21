import { query } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

function isAdmin(req) {
  const token = getTokenFromRequest(req)
  const user = verifyToken(token)
  return user && user.role === 'admin' ? user : null
}

export async function GET(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const res = await query(`
    SELECT u.id, u.name, u.username, u.role, u.temp_password, u.created_at,
      qr.score, qr.passed, qr.language, qr.completed_at
    FROM users u
    LEFT JOIN LATERAL (
      SELECT score, passed, language, completed_at FROM quiz_results
      WHERE user_id = u.id ORDER BY completed_at DESC LIMIT 1
    ) qr ON true
    ORDER BY u.created_at DESC
  `)
  return NextResponse.json({ users: res.rows })
}

export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const { name, username, temp_password } = await req.json()
    const hash = await bcrypt.hash(temp_password, 10)
    const res = await query(
      'INSERT INTO users (name, username, password_hash, temp_password, role) VALUES ($1, $2, $3, TRUE, $4) RETURNING id, name, username',
      [name, username.toLowerCase(), hash, 'user']
    )
    return NextResponse.json({ user: res.rows[0] })
  } catch (e) {
    if (e.code === '23505') return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
