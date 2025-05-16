import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My Next.js PWA',
    short_name: 'NextPWA',
    description: 'Пример PWA на Next.js 13+',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0d47a1',
    icons: [{ src: '/favicon-4.png', sizes: '192x192', type: 'image/png' }],
  }
}
