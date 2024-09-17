import { cookies as nextCookies } from 'next/headers'

const baseOptions = {
  httpOnly: true,
  sameSite: 'strict',
  path: '/'
}

const cookies = {
  set: (name: string, content: string, options?: any) =>
    nextCookies().set(name, content, { ...baseOptions, ...options }),
  get: (name: string) => nextCookies().get(name),
  has: (name: string) => nextCookies().has(name),
  delete: (name: string) => nextCookies().delete(name)
}

export default cookies
