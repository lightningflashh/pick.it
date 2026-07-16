import JWT from 'jsonwebtoken'

const generateToken = (payload: Record<string, unknown>, secretKey: string, tokenLife: string) => {
  return JWT.sign(payload, secretKey, {
    algorithm: 'HS256',
    expiresIn: tokenLife as JWT.SignOptions['expiresIn']
  })
}

const verifyToken = (token: string, secretKey: string) => {
  return JWT.verify(token, secretKey)
}

export const JwtProvider = {
  generateToken,
  verifyToken
}
