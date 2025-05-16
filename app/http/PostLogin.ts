import axios from 'axios'

type LoginResult = {
  id: string
}

const PostLogin = async (
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

export default PostLogin
