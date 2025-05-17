import { useEffect, useState } from 'react'
import { useChatSocketStore } from '../store/useChatSocketStore'
import { Message } from '../types'

export const useTextRoom = () => {
  const { socket, connect, disconnect } = useChatSocketStore()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[] | null>(null)

  const setRoom = async (id: string) => {
    if (socket?.connected) {
      await disconnect()
      setMessages(null)
    }

    setRoomId(id)
    connect()
  }

  const sendMessage = (content: string) => {
    if (!socket) return
    if (!roomId) return
    socket.emit('sendMessage', roomId, content)
  }

  useEffect(() => {
    if (!socket) return

    socket.on('connect', () => {
      console.log(roomId)
      socket.emit('setHistory', roomId as string)
    })

    socket.on('getHistory', (messages) => {
      console.log(messages)
      setMessages(messages)
    })

    return () => {
      disconnect()
    }
  }, [socket])

  return {
    setRoom,
    messages,
    sendMessage,
  }
}
