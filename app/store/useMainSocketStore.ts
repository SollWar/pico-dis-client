import {
  MainClientToServerEvents,
  MainServerToClientEvents,
} from '@/app/types/MainSocketTypes'
import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'

type SocketStore = {
  socket: TypedSocket | null
  connect: (url: string) => void
  disconnect: () => void
}

type TypedSocket = Socket<MainServerToClientEvents, MainClientToServerEvents>

export const useMainSocketStore = create<SocketStore>((set) => ({
  socket: null,
  url: null,
  connect: (url) => {
    const socketInstance = io(url + `/api/main`, {
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
