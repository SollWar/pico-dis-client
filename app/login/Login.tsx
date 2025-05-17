'use client'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../hook/useAuth'

const Login = () => {
  const router = useRouter()
  const [userLogin, setUserLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [process, setProcess] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const { login } = useAuth()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleLoad = () => setIsPageLoaded(true)
      window.addEventListener('load', handleLoad)

      if (document.readyState === 'complete') {
        setIsPageLoaded(true)
      }

      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setProcess(true)
    setError('') // Сбрасываем предыдущую ошибку

    try {
      await login(userLogin, password)
      router.replace('/main')
    } catch (error) {
      let errorMessage = ''
      if (error instanceof Error) {
        if (error.message === 'Неверные данные') {
          errorMessage = 'Неправильный логин/пароль'
        } else {
          errorMessage = 'Неизвестная ошибка'
        }
      }
      setError(errorMessage)
      setProcess(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mt-4 mb-8 text-2xl">Авторизация</div>
      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
        <div className="flex flex-col mb-1.5">
          <label htmlFor="login">Логин</label>
          <input
            disabled={process || !isPageLoaded}
            className="w-[280px] h-[38px] border-1 rounded-[5px]"
            id="login"
            type="text"
            value={userLogin}
            onChange={(e) => setUserLogin(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col mb-6">
          <label htmlFor="password">Пароль</label>
          <input
            disabled={process || !isPageLoaded}
            className="w-[280px] h-[38px] border-1 rounded-[5px]"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="mt-1.5 text-red-600">* {error}</div>}
        </div>

        <button
          style={{
            background: process || !isPageLoaded ? 'gray' : '#2B7FFF',
            cursor: process || !isPageLoaded ? 'progress' : 'pointer',
          }}
          disabled={process || !isPageLoaded}
          className=" w-[280px] h-[38px] mb-14 rounded-[5px] text-white"
          type="submit"
        >
          {process || !isPageLoaded ? 'Загрузка...' : 'Войти'}
        </button>
      </form>
    </div>
  )
}

export default Login
