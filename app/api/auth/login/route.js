import { query } from '@/lib/db'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { username, password } = await req.json()
    const res = await query('SELECT * FROM users WHERE username = $1', [username.toLowerCase()])
    const user = res.rows[0]
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ id: user.id, username: user.username, role: user.role, temp_password: user.temp_password })

    const response = NextResponse.json({
      token,
      temp_password: user.temp_password,
      role: user.role,
      name: user.name
    })

    // Set cookies via response headers for reliability
    const cookieOpts = 'Path=/; Max-Age=28800; SameSite=Lax; Secure'
    response.headers.append('Set-Cookie', `token=${token}; ${cookieOpts}`)
    response.headers.append('Set-Cookie', `userRole=${user.role}; ${cookieOpts}`)
    response.headers.append('Set-Cookie', `userName=${encodeURIComponent(user.name)}; ${cookieOpts}`)

    return response
  } catch (e) {
    console.error('Login error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
