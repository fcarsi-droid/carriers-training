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
    
    // Set httpOnly cookie - persists across redirects
    response.cookies.set('token', token, {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/'
    })
    response.cookies.set('userRole', user.role, {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/'
    })
    response.cookies.set('userName', user.name, {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/'
    })
    
    return response
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
