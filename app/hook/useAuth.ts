import { axiosPost } from '../lib/axiosMethods'

type AuthResult = {
  id: string
}

export const useAuth = () => {
  const login = async (
    login: string,
    password: string
  ): Promise<AuthResult> => {
    return await axiosPost<AuthResult, { login: string; password: string }>(
      { login, password },
      process.env.NEXT_PUBLIC_API_URL + '/api/login'
    )
  }

  const register = async (
    login: string,
    password: string
  ): Promise<AuthResult> => {
    return await axiosPost<AuthResult, { login: string; password: string }>(
      { login, password },
      process.env.NEXT_PUBLIC_API_URL + '/api/reg'
    )
  }

  return { login, register }
}
