export const sessionOptions = {
  password: 'vHwv2rwmNpKGJLUuCCMjsAcyPNAdwByZ', // строка ≥ 32 байт
  cookieName: 'myapp_session',
  cookieOptions: {
    domain: process.env.COOCKE_DOMAIN,
    secure: process.env.NEXT_ENV === 'production', // в проде — по HTTPS
    httpOnly: true,
    sameSite: 'Strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  },
}
