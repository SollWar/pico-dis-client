import { create } from 'zustand'

interface ConsumerInfo {
  user_id: string
  id: string
  gain: number
}

interface UserVoiceState {
  gainNodes: Record<string, GainNode>
  consumers: ConsumerInfo[]
  addGainNodes: (consumerId: string, gainNode: GainNode) => void
  addConsumer: (consumer: ConsumerInfo) => void
  changeGainNodes: (id: string, value: number) => void
  retainConsumersByUserIds: (userIds: string[]) => void
  clearAll: () => void
}

export const useUserVoiceStore = create<UserVoiceState>((set, get) => ({
  gainNodes: {},
  consumers: [],
  addGainNodes(consumerId, gainNode) {
    const gainNodes = { ...get().gainNodes, [consumerId]: gainNode }
    set({ gainNodes })
  },
  changeGainNodes(id, value) {
    const gainNodes = get().gainNodes
    const targetGainNode = gainNodes[id]
    if (targetGainNode) {
      targetGainNode.gain.value = value
    }

    const consumers = get().consumers.map((c) =>
      c.id === id ? { ...c, gain: value } : c
    )

    set((state) => ({ ...state, consumers }))
  },
  addConsumer(consumer) {
    const consumers = [...get().consumers, consumer]
    set({ consumers })
  },
  retainConsumersByUserIds(userIdsToKeep: string[]) {
    const { consumers, gainNodes } = get()

    // Оставляем только нужных consumers
    const filteredConsumers = consumers.filter((c) =>
      userIdsToKeep.includes(c.user_id)
    )

    // Список ID, которые нужно оставить
    const idsToKeep = new Set(filteredConsumers.map((c) => c.id))

    // Оставляем только нужные GainNode'ы
    const filteredGainNodes: Record<string, GainNode> = {}
    for (const id of Object.keys(gainNodes)) {
      if (idsToKeep.has(id)) {
        filteredGainNodes[id] = gainNodes[id]
      }
    }

    set({
      consumers: filteredConsumers,
      gainNodes: filteredGainNodes,
    })
  },
  clearAll() {
    set({
      consumers: [],
      gainNodes: {},
    })
  },
}))
