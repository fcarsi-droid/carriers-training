import { query } from '@/lib/db'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { email, password } = await req.json()
    const res = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
    const user = res.rows[0]
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ id: user.id, email: user.email, role: user.role, temp_password: user.temp_password })
    return NextResponse.json({ token, temp_password: user.temp_password, role: user.role, name: user.name })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
