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
  // 1. Try Authorization header
  const auth = req.headers.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.replace('Bearer ', '').trim()
    if (token && token !== 'null' && token !== 'undefined') return token
  }
  // 2. Try cookie (set by login API)
  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/)
  if (match) {
    const token = decodeURIComponent(match[1]).trim()
    if (token && token !== 'null' && token !== 'undefined') return token
  }
  return null
}
