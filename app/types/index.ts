export interface PublicUser {
  id: string
  login: string
  was: string
  created_at: Date
}

export type RoomType = 'text' | 'voice' | 'personal'

export interface Room {
  id: string
  owner_id: string
  type: RoomType
  name: string
  created_at: Date
}

export interface Message {
  id: string
  room_id: string
  user_id: string
  content: string
  created_at: Date
}

export const findRoomById = (
  rooms: Room[] | null,
  id: string | null
): Room | undefined => {
  if (!rooms) return undefined
  if (!id) return undefined
  return rooms.find((room) => room.id === id)
}

export const roomType: string[] = ['text', 'voice', 'personal']

export const getRoomsByType = <T extends Room['type']>(
  type: T,
  rooms: Room[]
): Room[] => {
  return rooms.filter((room) => room.type === type)
}
