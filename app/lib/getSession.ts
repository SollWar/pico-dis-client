import { cookies } from 'next/headers'
import { unsealData } from 'iron-session'
import { sessionOptions } from './sessionOptions'

export async function getSession(): Promise<string | null> {
  type AuthSession = {
    id?: string
    expiresAt?: Date
  }

  const cookieStore = cookies()
  const sealed = (await cookieStore).get(sessionOptions.cookieName)?.value
  if (!sealed) return null

  try {
    const session = await unsealData<AuthSession>(sealed, {
      password: sessionOptions.password as string,
    })

    if (session && typeof session === 'object' && 'id' in session) {
      console.log(session)
      if (session.id) {
        return session.id
      } else {
        return null
      }
    }
  } catch (e) {
    console.error('Session decode error:', e)
  }

  return null
}
