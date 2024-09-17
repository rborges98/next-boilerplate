import { jwtVerify, SignJWT } from 'jose'

const TOKEN_SECRET = 'abublebuble' //TODO: melhorar isso aqui e transformar numa const
const REFRESH_TOKEN_SECRET = 'abublebuble-refresh'

const tokenMapper = {
  accessToken: {
    name: 'accessToken',
    secret: TOKEN_SECRET,
    expires: '15m'
  },
  refreshToken: {
    name: 'refreshToken',
    secret: REFRESH_TOKEN_SECRET,
    expires: '7d'
  }
}

type TokenType = 'accessToken' | 'refreshToken'

const token = {
  create: async (type: TokenType, email: string) => {
    const secretKey = new TextEncoder().encode(tokenMapper[type].secret)

    try {
      const token = await new SignJWT({ user: email })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(tokenMapper[type].expires)
        .sign(secretKey)

      return token
    } catch (error) {
      console.log(error)
    }
  },
  verify: async (type: TokenType, token: string) => {
    // Converte o secret para bytes
    const secretKey = new TextEncoder().encode(tokenMapper[type].secret)

    try {
      const { payload } = await jwtVerify(token, secretKey)
      return payload
    } catch (err) {
      console.error('Token verification failed:', err)
      return null
    }
  }
}

export default token
