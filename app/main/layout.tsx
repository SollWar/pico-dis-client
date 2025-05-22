import Script from 'next/script'
import GlobalLoader from '../components/GlobalLoader'

export const metadata = {
  title: 'PicoDis - Главная',
  description: 'Простой аналог Discord',
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const serverUrl = process.env.SERVER_URL
  console.log(serverUrl)

  return (
    <>
      {/* <SWorker /> */}
      <Script src="/rnnoise-runtime.js" strategy="lazyOnload" />
      <GlobalLoader serverUrl={serverUrl as string}>{children}</GlobalLoader>
    </>
  )
}
