import { PublicUser, Room } from '@/app/types'
import { create } from 'zustand'

interface UserState {
  user: PublicUser | null
  rooms: Room[] | null
  setUser: (user: PublicUser) => void
  setUserRooms: (rooms: Room[]) => void
}

export const useUserDataStore = create<UserState>((set) => ({
  user: null,
  rooms: null,
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
