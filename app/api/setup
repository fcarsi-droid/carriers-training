import { query } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const password = 'TPOTMtrainning2026'
  const hash = await bcrypt.hash(password, 10)
  await query('UPDATE users SET password_hash = $1 WHERE username = $2', [hash, 'admin'])
  return NextResponse.json({ ok: true, hash })
}
