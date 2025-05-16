export const metadata = {
  title: 'PicoDis - Профиль',
  description: 'Простой аналог Discord',
}

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
