'use client'
import { ReactNode, useEffect } from 'react'
import { useGlobalLoader } from '@/app/hook/useGlobalLoader'
import { useMainSocketStore } from '../store/useMainSocketStore'
import LoadingScreen from './Loading'

export default function GlobalLoader({ children }: { children: ReactNode }) {
  const { loaded } = useGlobalLoader()
  const { connect, disconnect } = useMainSocketStore()

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [])

  if (!loaded) {
    return <LoadingScreen />
  }

  return <>{children}</>
}
