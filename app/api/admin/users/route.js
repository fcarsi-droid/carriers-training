import { query } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

function isAdmin(req) {
  const token = getTokenFromRequest(req)
  const user = verifyToken(token)
  return user && user.role === 'admin' ? user : null
}

function generatePassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#'
  return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function GET(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const res = await query(`
    SELECT u.id, u.name, u.first_name, u.last_name, u.username, u.carrier, u.role, u.temp_password, u.created_at,
      qr.score, qr.passed, qr.language, qr.section, qr.completed_at
    FROM users u
    LEFT JOIN LATERAL (
      SELECT score, passed, language, section, completed_at FROM quiz_results
      WHERE user_id = u.id ORDER BY completed_at DESC LIMIT 1
    ) qr ON true
    ORDER BY u.carrier, u.name
  `)
  return NextResponse.json({ users: res.rows })
}

export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const { first_name, last_name, carrier, role } = await req.json()
    const username = `${first_name.toLowerCase().trim()}.${last_name.toLowerCase().trim()}`.replace(/\s+/g, '')
    const name = `${first_name.trim()} ${last_name.trim()}`
    const temp_password = generatePassword()
    const hash = await bcrypt.hash(temp_password, 10)
    const res = await query(
      'INSERT INTO users (name, first_name, last_name, username, carrier, password_hash, temp_password, role) VALUES ($1, $2, $3, $4, $5, $6, TRUE, $7) RETURNING id, name, username',
      [name, first_name.trim(), last_name.trim(), username, carrier, hash, role || 'user']
    )
    return NextResponse.json({ user: res.rows[0], username, temp_password })
  } catch (e) {
    if (e.code === '23505') return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
