import { PublicUser, Room } from '@/app/types'
import axios from 'axios'
import { create } from 'zustand'

interface UserState {
  user: PublicUser | null
  rooms: Room[] | null
  getUser: () => void
  setUserRooms: (rooms: Room[]) => void
}

type userDataResult = {
  ok: boolean
  user?: PublicUser
  error?: string
}

const getUserData = async (): Promise<PublicUser | null> => {
  try {
    const { data } = await axios.get<userDataResult>(
      'http://localhost:3001/api/user',
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    )

    if (data.ok && data.user) {
      return data.user
    }

    console.warn('Ответ сервера без пользователя:', data)
    return null
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Сервер ответил, но не 2xx (например, 401, 403, 500)
        console.error(
          `Ошибка от сервера (${error.response.status}):`,
          error.response.data
        )
      } else if (error.request) {
        // Запрос ушел, но ответа не было
        console.error('Нет ответа от сервера:', error.request)
      } else {
        // Ошибка при настройке запроса
        console.error('Ошибка конфигурации запроса:', error.message)
      }
    } else {
      // Неизвестная ошибка
      console.error('Непредвиденная ошибка:', error)
    }

    return null
  }
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  rooms: null,
  getUser: async () => {
    const userData = await getUserData()
    if (userData) {
      set({ user: userData })
    }
  },
  setUserRooms: (rooms) => {
    set((state) => ({
      ...state,
      rooms,
    }))
  },
}))
