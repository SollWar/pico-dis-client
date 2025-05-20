import { PublicUser, Room } from '.'

export interface MainClientToServerEvents {
  setRoom: (id: string) => void
  createRoom: (name: string, type: string) => void
}

export interface MainServerToClientEvents {
  test: (usersInVoiceRooms: Record<string, string[]>) => void
  roomCreated: (room_id: string) => void
  getRooms: (rooms: Room[]) => void
  getUser: (user: PublicUser) => void
}
