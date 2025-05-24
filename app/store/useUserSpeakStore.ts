import { create } from 'zustand'

interface UserSpeakState {
  speakUsers: Record<string, boolean>
  setSpeakUsers: (userId: string, speak: boolean) => void
}

export const useUserSpeakStore = create<UserSpeakState>((set, get) => ({
  speakUsers: {},
  setSpeakUsers(userId, speak) {
    const speakUsers = get().speakUsers
    speakUsers[userId] = speak
    set({
      speakUsers,
    })
  },
}))
