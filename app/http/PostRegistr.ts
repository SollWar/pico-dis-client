import axios from 'axios'

const PostRegistr = async (login: string, password: string) => {
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

export default PostRegistr
