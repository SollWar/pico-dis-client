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

declare global {
  interface Window {
    RNNoiseNode: {
      /**
       * Регистрирует AudioWorkletProcessor.
       * @param context — AudioContext, в который добавляем процессор.
       */
      register(context: AudioContext): Promise<void>

      /**
       * Создаёт экземпляр узла шумоподавления.
       * @param context — AudioContext, к которому привязываем узел.
       * @param options.gain — начальный коэффициент усиления (по умолчанию 1.0).
       */
      new (
        context: AudioContext,
        options?: { gain?: number }
      ): AudioWorkletNode & {
        /**
         * Изменяет коэффициент усиления в реальном времени.
         * @param gain — новое значение gain.
         */
        updateGain(gain: number): void
      }
    }
  }
}

export {}
