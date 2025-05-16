import axios from 'axios'

type LoginResult = {
  id: string
}

export const useAuth = () => {
  const login = async (
    login: string,
    password: string
  ): Promise<LoginResult> => {
    const { data } = await axios.post<LoginResult>(
      'http://localhost:3001/api/login',
      { login, password },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    )
    return data
  }
  const register = async (login: string, password: string) => {
    const { data } = await axios.post(
      'http://localhost:3001/api/reg',
      { login, password },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    )

    return data
  }
  return { login, register }
}
