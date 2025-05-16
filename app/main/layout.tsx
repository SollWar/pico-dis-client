import GlobalLoader from '../components/GlobalLoader'
import SWorker from './sworker'

export const metadata = {
  title: 'PicoDis - Главная',
  description: 'Простой аналог Discord',
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SWorker />
      <GlobalLoader>{children}</GlobalLoader>
    </>
  )
}
