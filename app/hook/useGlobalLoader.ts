import { useEffect, useState } from 'react'
import { useMainSocketStore } from '../store/useMainSocketStore'
import { useUserDataStore } from '../store/useUserDataStore'
import { useUserVoiceStore } from '../store/useUserVoiceStore'
import { useIdsHelperStore } from '../store/useIdsHelperStore'

export const useGlobalLoader = () => {
  const [loaded, setLoaded] = useState(false)
  const { user, rooms, setUser, setUserRooms, setUsersInVoiceRooms } =
    useUserDataStore()
  const { socket } = useMainSocketStore()
  const { retainConsumersByUserIds } = useUserVoiceStore()
  const { idToLogin, setLoginFromId } = useIdsHelperStore()

  useEffect(() => {
    if (user && rooms && idToLogin) {
      setLoaded(true)
    }
  }, [user, rooms, idToLogin])

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

    socket.emit('getUsersLogin', (response) => {
      setLoginFromId(response)
    })

    socket.emit('getUsersInVoiceRooms')

    socket.on('setUsersInVoiceRooms', (usersInVoiceRooms) => {
      setUsersInVoiceRooms(usersInVoiceRooms)
      Object.values(usersInVoiceRooms).forEach((users) => {
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
