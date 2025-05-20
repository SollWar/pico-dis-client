import Script from 'next/script'
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
      <Script src="/rnnoise-runtime.js" strategy="lazyOnload" />
      <GlobalLoader>{children}</GlobalLoader>
    </>
  )
}
