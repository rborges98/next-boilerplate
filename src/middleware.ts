import token from '@/services/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')
  const refreshToken = request.cookies.get('refreshToken')

  const requestPathname = request.nextUrl.pathname
  const isLoginPath = Boolean(requestPathname.match(/login|verify/))

  try {
    if (accessToken) {
      const isValid = await token.verify(
        'accessToken',
        accessToken?.value as string
      )

      return isValid && isLoginPath
        ? NextResponse.redirect(new URL('/', request.url))
        : NextResponse.next()
    }

    if (refreshToken) {
      const refreshTokenContent = JSON.parse(refreshToken.value)
      const isValid = await token.verify(
        'refreshToken',
        refreshTokenContent.token as string
      )

      if (isValid) {
        const newAccessToken = await token.create(
          'accessToken',
          refreshTokenContent.user
        )

        const response = isLoginPath
          ? NextResponse.redirect(new URL('/', request.url))
          : NextResponse.next()

        const cookieOptions = {
          accessToken: newAccessToken,
          Path: '/',
          HttpOnly: 'Secure',
          'Max-Age': 15 * 60,
          SameSite: 'Lax'
        }

        response.headers.set(
          'Set-Cookie',
          JSON.stringify(cookieOptions)
          // `accessToken=${newAccessToken}; Path=/; HttpOnly; Secure; Max-Age=${15 * 60}; SameSite=Lax`
        )

        return response
      }
    }
  } catch (error) {
    console.log(error)
  }

  return isLoginPath
    ? NextResponse.next()
    : NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
