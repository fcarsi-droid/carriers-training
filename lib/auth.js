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
  const auth = req.headers.get('authorization')
  if (!auth) return null
  return auth.replace('Bearer ', '')
}
