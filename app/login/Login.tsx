'use client'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { useUserStore } from '../store/useStore'
import { useAuth } from '../hook/useAuth'

const Login = () => {
  const router = useRouter()
  const [userLogin, setUserLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [process, setProcess] = useState(false)
  const { getUser } = useUserStore()
  const { login } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setProcess(true)

    try {
      await login(userLogin, password)
      getUser()
      router.replace('/main')
    } catch {
      setError('Неверный логин/пароль')
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
            background: process ? 'gray' : '#2B7FFF',
            cursor: process ? 'progress' : 'pointer',
          }}
          disabled={process}
          className=" w-[280px] h-[38px] mb-14 rounded-[5px] text-white"
          type="submit"
        >
          Войти
        </button>
      </form>
    </div>
  )
}

export default Login
