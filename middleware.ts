import { NextResponse, type NextRequest } from 'next/server'
import { unsealData } from 'iron-session'
import { sessionOptions } from './app/lib/sessionOptions'

type Session = { id?: string; expiresAt?: Date }

async function getSession(req: NextRequest): Promise<Session | null> {
  const sealed = req.cookies.get(sessionOptions.cookieName)?.value
  if (!sealed) return null

  try {
    return (await unsealData(sealed, {
      password: sessionOptions.password as string,
    })) as Session
  } catch (e) {
    console.error('Session unseal error:', e)
    return null
  }
}

function redirectTo(path: string, req: NextRequest): NextResponse {
  const url = req.nextUrl.clone()
  url.pathname = path
  return NextResponse.redirect(url)
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl
  const session = await getSession(req)

  // Логика редиректа для корня и /login
  if (pathname === '/' || pathname === '/login') {
    if (session?.id) {
      return redirectTo('/main', req)
    }
    if (pathname === '/') {
      return redirectTo('/login', req)
    }
  }

  // Логика для защищённых маршрутов /profile/*
  if (pathname.startsWith('/main')) {
    if (!session?.id) {
      return redirectTo('/login', req)
    }
  }

  // Для всех других маршрутов пропускаем
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/main/:path*', '/login'],
}
