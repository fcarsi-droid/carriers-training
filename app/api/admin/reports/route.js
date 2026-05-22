import { query } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const token = getTokenFromRequest(req)
  const user = verifyToken(token)
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Overall stats
  const overall = await query(`
    SELECT
      COUNT(DISTINCT u.id) as total_users,
      COUNT(DISTINCT CASE WHEN qr.id IS NOT NULL THEN u.id END) as started,
      COUNT(DISTINCT CASE WHEN qr.passed = true THEN u.id END) as passed,
      COUNT(DISTINCT CASE WHEN qr.passed = false AND qr.id IS NOT NULL THEN u.id END) as failed,
      COUNT(DISTINCT CASE WHEN qr.id IS NULL THEN u.id END) as not_started
    FROM users u
    LEFT JOIN quiz_results qr ON qr.user_id = u.id
    WHERE u.role = 'user'
  `)

  // By carrier
  const byCarrier = await query(`
    SELECT
      u.carrier,
      COUNT(DISTINCT u.id) as total,
      COUNT(DISTINCT CASE WHEN qr.passed = true THEN u.id END) as passed,
      COUNT(DISTINCT CASE WHEN qr.passed = false AND qr.id IS NOT NULL THEN u.id END) as failed,
      COUNT(DISTINCT CASE WHEN qr.id IS NULL THEN u.id END) as not_started,
      ROUND(AVG(CASE WHEN qr.score IS NOT NULL THEN qr.score END), 1) as avg_score
    FROM users u
    LEFT JOIN LATERAL (
      SELECT score, passed FROM quiz_results WHERE user_id = u.id ORDER BY completed_at DESC LIMIT 1
    ) qr ON true
    WHERE u.role = 'user'
    GROUP BY u.carrier
    ORDER BY avg_score DESC NULLS LAST
  `)

  // Weekly completions (last 8 weeks)
  const weekly = await query(`
    SELECT
      DATE_TRUNC('week', completed_at) as week,
      COUNT(*) as completions,
      COUNT(CASE WHEN passed = true THEN 1 END) as passed
    FROM quiz_results
    WHERE completed_at >= NOW() - INTERVAL '8 weeks'
    GROUP BY DATE_TRUNC('week', completed_at)
    ORDER BY week ASC
  `)

  // All users with full history
  const users = await query(`
    SELECT
      u.id, u.name, u.username, u.carrier, u.role, u.temp_password, u.created_at,
      json_agg(
        json_build_object(
          'section', qr.section,
          'score', qr.score,
          'passed', qr.passed,
          'language', qr.language,
          'completed_at', qr.completed_at
        ) ORDER BY qr.completed_at DESC
      ) FILTER (WHERE qr.id IS NOT NULL) as attempts
    FROM users u
    LEFT JOIN quiz_results qr ON qr.user_id = u.id
    WHERE u.role = 'user'
    GROUP BY u.id, u.name, u.username, u.carrier, u.role, u.temp_password, u.created_at
    ORDER BY u.carrier, u.name
  `)

  return NextResponse.json({
    overall: overall.rows[0],
    byCarrier: byCarrier.rows,
    weekly: weekly.rows,
    users: users.rows
  })
}
