import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'
import {
  ChatClientToServerEvents,
  ChatServerToClientEvents,
} from '../types/ChatSocketTypes'

type SocketStore = {
  socket: TypedSocket | null
  connect: () => void
  disconnect: () => void
}

type TypedSocket = Socket<ChatServerToClientEvents, ChatClientToServerEvents>

export const useChatSocketStore = create<SocketStore>((set, get) => ({
  socket: null,

  connect: async () => {
    const { socket } = get()
    if (socket?.connected) return // Уже подключен

    if (socket) {
      socket.disconnect()
    }
    const socketInstance = io('http://localhost:3001/api/chat', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })

    set({ socket: socketInstance })
  },

  disconnect: async () => {
    const { socket } = get()
    if (!socket) return

    socket.disconnect()
    set({ socket: null })
  },
}))
