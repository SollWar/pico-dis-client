import axios from 'axios'

export const axiosPost = async <T, Args extends Record<string, any>>(
  args: Args,
  path: string
): Promise<T> => {
  // Убрали `| null`, теперь при ошибке будет исключение
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
        // Пробрасываем ошибку с сервера (например, 401, 500)
        console.error(error.response.data.message || 'Неверные данные')
        throw new Error(error.response.data.message || 'Неверные данные')
      } else if (error.request) {
        console.error('Нет ответа от сервера')
        throw new Error('Нет ответа от сервера')
      } else {
        console.error('Ошибка при отправке запроса')
        throw new Error('Ошибка при отправке запроса')
      }
    } else {
      console.error('Неизвестная ошибка')
      throw new Error('Неизвестная ошибка')
    }
  }
}
