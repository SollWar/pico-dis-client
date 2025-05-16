'use client'
import { useEffect } from 'react'

const SWorker = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register(
            '/sw.js',
            {
              scope: '/',
            }
          )
          console.log('SW registered:', registration)
        } catch (err) {
          console.error('SW registration failed:', err)
        }
      })
    }
  }, [])

  return <></>
}

export default SWorker
