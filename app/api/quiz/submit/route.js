import { query } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req)
    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { score, passed, answers, language } = await req.json()
    await query(
      'INSERT INTO quiz_results (user_id, language, score, passed, answers) VALUES ($1, $2, $3, $4, $5)',
      [user.id, language, score, passed, JSON.stringify(answers)]
    )
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const token = getTokenFromRequest(req)
    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const res = await query(
      'SELECT score, passed, language, completed_at FROM quiz_results WHERE user_id = $1 ORDER BY completed_at DESC LIMIT 1',
      [user.id]
    )
    return NextResponse.json({ result: res.rows[0] || null })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
