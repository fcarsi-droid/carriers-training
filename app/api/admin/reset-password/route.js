import { query } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const token = getTokenFromRequest(req)
  const user = verifyToken(token)
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { user_id, new_password } = await req.json()
  const hash = await bcrypt.hash(new_password, 10)
  await query('UPDATE users SET password_hash = $1, temp_password = TRUE WHERE id = $2', [hash, user_id])
  return NextResponse.json({ success: true })
}
