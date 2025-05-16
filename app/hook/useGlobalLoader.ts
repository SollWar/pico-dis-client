import { useEffect, useState } from 'react'
import { useMainSocketStore } from '../store/useMainSocketStore'
import { useUserStore } from '../store/useStore'

export const useGlobalLoader = () => {
  const [loaded, setLoaded] = useState(false)
  const { user, rooms, getUser, setUserRooms } = useUserStore()
  const { socket } = useMainSocketStore()

  useEffect(() => {
    if (!user) {
      getUser()
    }
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

    socket.on('connect_error', (err) => {
      console.log(err)
    })
  }, [socket])

  return {
    loaded,
  }
}
