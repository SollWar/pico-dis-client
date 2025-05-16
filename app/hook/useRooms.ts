import { useMainSocketStore } from '../store/useMainSocketStore'

export const useRooms = () => {
  const { socket } = useMainSocketStore()
  const roomClick = (id: string) => {
    if (!socket) return
    socket.emit('setRoom', id)
  }

  return {
    roomClick,
  }
}
