import { PublicUser, Room } from '@/app/types'
import { create } from 'zustand'

interface UserDataState {
  user: PublicUser | null
  rooms: Room[] | null
  usersInVoiceRooms: Record<string, string[]> | null
  setUser: (user: PublicUser) => void
  setUserRooms: (rooms: Room[]) => void
  setUsersInVoiceRooms: (usersInVoiceRooms: Record<string, string[]>) => void
}

export const useUserDataStore = create<UserDataState>((set) => ({
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
}))
