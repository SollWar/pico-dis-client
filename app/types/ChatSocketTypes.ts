import { Message } from '.'

export interface ChatClientToServerEvents {
  setHistory: (id: string) => void
  sendMessage: (room_id: string, content: string) => void
}

export interface ChatServerToClientEvents {
  getHistory: (messages: Message[]) => void
}
