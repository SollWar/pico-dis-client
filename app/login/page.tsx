'use client'
import { useState } from 'react'
import Login from './Login'
import Reg from './Reg'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  const formChange = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="fixed w-full h-[100%] flex flex-col items-center justify-center left-0 top-0">
      {isLogin ? <Login /> : <Reg />}
      {isLogin ? 'Нет аккаунта?' : 'Есть аккаунт?'}
      <button className=" cursor-pointer text-[#2B7FFF]" onClick={formChange}>
        {isLogin ? 'Регистрация' : 'Авторизация'}
      </button>
    </div>
  )
}
