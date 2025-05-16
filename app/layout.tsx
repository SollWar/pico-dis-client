import './globals.css'

export const metadata = {
  title: 'PicoDis - Старт',
  description: 'Простой аналог Discord',
  manifest: './manifest.ts',
  icons: {
    icon: '/favicon-4.png',
    apple: '/icons/icon-192.png', // для iOS
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
