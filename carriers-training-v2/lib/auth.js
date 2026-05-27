import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'changeme'

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

export function getTokenFromRequest(req) {
  // Try Authorization header first
  const auth = req.headers.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.replace('Bearer ', '').trim()
    if (token && token !== 'null' && token !== 'undefined') return token
  }
  // Fallback to cookie
  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/)
  if (match) return match[1]
  return null
}
