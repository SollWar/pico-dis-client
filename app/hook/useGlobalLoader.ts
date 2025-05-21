import { useEffect, useState } from 'react'
import { useMainSocketStore } from '../store/useMainSocketStore'
import { useUserDataStore } from '../store/useUserDataStore'
import { useUserVoiceStore } from '../store/useUserVoiceStore'

export const useGlobalLoader = () => {
  const [loaded, setLoaded] = useState(false)
  const { user, rooms, setUser, setUserRooms, setUsersInVoiceRooms } =
    useUserDataStore()
  const { socket } = useMainSocketStore()
  const { retainConsumersByUserIds } = useUserVoiceStore()

  useEffect(() => {
    if (user && rooms) {
      setLoaded(true)
    }
  }, [user, rooms])

  useEffect(() => {
    if (!socket) return

    socket.on('connect', () => {
      console.log('Успешное подключение')
    })

    socket.on('disconnect', () => {
      console.log('Успешное отключение')
    })

    socket.on('getRooms', (rooms) => {
      setUserRooms(rooms)
    })

    socket.on('test', (usersInVoiceRooms) => {
      setUsersInVoiceRooms(usersInVoiceRooms)
      Object.entries(usersInVoiceRooms).map(([roomId, users]) => {
        retainConsumersByUserIds(users)
      })
    })

    socket.on('getUser', (user) => {
      setUser(user)
    })

    socket.on('connect_error', (err) => {
      console.log(err)
    })
  }, [socket])

  return {
    loaded,
  }
}
