'use client'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { useUserStore } from '../store/useStore'
import { useAuth } from '../hook/useAuth'

const Reg = () => {
  const router = useRouter()
  const [userLogin, setUserLogin] = useState('')
  const [password, setPassword] = useState('')
  const [secondPassword, setSecondPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [process, setProcess] = useState(false)
  const { getUser } = useUserStore()
  const { login, register } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (password !== secondPassword) {
      setError('Пароли не совпадают')
      return
    }

    try {
      setProcess(true)
      await register(userLogin, password)
      await login(userLogin, password)
      getUser()
      router.replace('/main')
    } catch {
      setError('Ошибка при регистрации')
      setProcess(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mt-4 mb-8 text-2xl">Регистрация</div>
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
        <div className="flex flex-col mb-1.5">
          <label htmlFor="password">Пароль</label>
          <input
            className="w-[280px] h-[38px] border-1 rounded-[5px]"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col mb-6">
          <label htmlFor="secondPassword">Повторите пароль</label>
          <input
            className="w-[280px] h-[38px] border-1 rounded-[5px]"
            id="secondPassword"
            type="password"
            value={secondPassword}
            onChange={(e) => setSecondPassword(e.target.value)}
            required
          />
          {error && <div className="mt-1.5 text-red-600">* {error}</div>}
        </div>

        <button
          style={{
            background: process ? 'gray' : '#2B7FFF',
          }}
          className=" w-[280px] h-[38px] mb-14 rounded-[5px] bg-[#2B7FFF] text-white cursor-pointer"
          type="submit"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  )
}

export default Reg
