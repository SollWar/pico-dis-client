import {
  MainClientToServerEvents,
  MainServerToClientEvents,
} from '@/app/types/MainSocketTypes'
import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'

type SocketStore = {
  socket: TypedSocket | null
  connect: () => void
  disconnect: () => void
}

type TypedSocket = Socket<MainServerToClientEvents, MainClientToServerEvents>

export const useMainSocketStore = create<SocketStore>((set) => ({
  socket: null,

  connect: () => {
    const socketInstance = io(`${'https://192.168.1.102:3001'}/api/main`, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })
    set({ socket: socketInstance })
  },

  disconnect: () => {
    const { socket: socket } = useMainSocketStore.getState()
    socket?.disconnect()
    set({ socket: null })
  },
}))
