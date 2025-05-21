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
      'https://192.168.1.102:3001/api/login'
    )
  }

  const register = async (
    login: string,
    password: string
  ): Promise<AuthResult> => {
    return await axiosPost<AuthResult, { login: string; password: string }>(
      { login, password },
      'https://192.168.1.102:3001/api/reg'
    )
  }

  return { login, register }
}
