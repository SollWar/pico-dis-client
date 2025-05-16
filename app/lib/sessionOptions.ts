export const sessionOptions = {
  password: 'vHwv2rwmNpKGJLUuCCMjsAcyPNAdwByZ', // строка ≥ 32 байт
  cookieName: 'myapp_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // в проде — по HTTPS
    httpOnly: true,
    sameSite: 'Strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  },
}
