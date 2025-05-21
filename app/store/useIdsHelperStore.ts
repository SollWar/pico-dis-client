import { create } from 'zustand'

interface IdsHelperStore {
  idToLogin: Record<string, string> | null
  setLoginFromId: (idToLogin: Record<string, string>) => void
  getLoginFromId: (userId: string) => string
}

export const useIdsHelperStore = create<IdsHelperStore>((set, get) => ({
  idToLogin: null,
  setLoginFromId(idToLogin) {
    set({
      idToLogin,
    })
  },
  getLoginFromId(userId) {
    const login = get().idToLogin![userId]
    if (login) {
      return login
    } else {
      return userId
    }
  },
}))
