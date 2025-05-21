import { PublicUser, Room } from '@/app/types'
import { create } from 'zustand'

interface UserDataState {
  user: PublicUser | null
  rooms: Room[] | null
  usersInVoiceRooms: Record<string, string[]> | null
  setUser: (user: PublicUser) => void
  setUserRooms: (rooms: Room[]) => void
  setUsersInVoiceRooms: (usersInVoiceRooms: Record<string, string[]>) => void
  getRoomNameFromId: (id: string) => string
}

export const useUserDataStore = create<UserDataState>((set, get) => ({
  user: null,
  rooms: null,
  usersInVoiceRooms: null,
  setUsersInVoiceRooms(usersInVoiceRooms) {
    set((state) => ({
      ...state,
      usersInVoiceRooms,
    }))
  },
  setUser(user) {
    set((state) => ({
      ...state,
      user,
    }))
  },
  setUserRooms: (rooms) => {
    set((state) => ({
      ...state,
      rooms,
    }))
  },
  getRoomNameFromId(id) {
    let roomName = ''
    get().rooms?.forEach((room, index) => {
      console.log(room.name)
      if (room.id === id) {
        roomName = room.name
      }
    })
    return roomName
  },
}))
