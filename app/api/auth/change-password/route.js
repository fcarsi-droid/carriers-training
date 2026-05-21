import { query } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req)
    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { password } = await req.json()
    if (!password || password.length < 8)
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })

    const hash = await bcrypt.hash(password, 10)
    await query('UPDATE users SET password_hash = $1, temp_password = FALSE WHERE id = $2', [hash, user.id])
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
