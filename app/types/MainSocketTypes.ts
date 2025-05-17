import { PublicUser, Room } from '.'

export interface MainClientToServerEvents {
  setRoom: (id: string) => void
}

export interface MainServerToClientEvents {
  getRooms: (rooms: Room[]) => void
  getUser: (user: PublicUser) => void
}
