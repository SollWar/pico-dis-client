'use client'
import { ReactNode, useEffect } from 'react'
import { useGlobalLoader } from '@/app/hook/useGlobalLoader'
import { useMainSocketStore } from '../store/useMainSocketStore'
import LoadingScreen from './Loading'

interface GlobalLoaderProps {
  children: ReactNode
  serverUrl: string
}

export default function GlobalLoader({
  children,
  serverUrl,
}: GlobalLoaderProps) {
  const { loaded } = useGlobalLoader()
  const { connect, disconnect } = useMainSocketStore()

  useEffect(() => {
    connect(serverUrl)

    return () => {
      disconnect()
    }
  }, [])

  if (!loaded) {
    return <LoadingScreen />
  }

  return <>{children}</>
}
