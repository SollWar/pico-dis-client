import axios from 'axios'

export const axiosPost = async <T, Args extends Record<string, unknown>>(
  args: Args,
  path: string
): Promise<T> => {
  try {
    const { data } = await axios.post<T>(
      path,
      { ...args },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          typeof error.response.data?.message === 'string'
            ? error.response.data.message
            : 'Неверные данные'
        console.error(errorMessage)
        throw new Error(errorMessage)
      } else if (error.request) {
        console.error('Нет ответа от сервера')
        throw new Error('Нет ответа от сервера')
      } else {
        console.error('Ошибка при отправке запроса:', error.message)
        throw new Error('Ошибка при отправке запроса')
      }
    }
    console.error('Неизвестная ошибка:', error)
    throw new Error('Неизвестная ошибка')
  }
}
