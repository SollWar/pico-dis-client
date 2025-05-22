// voice.socket.model.ts

import {
  RtpCapabilities,
  DtlsParameters,
  IceCandidate,
  MediaKind,
  RtpParameters,
  IceParameters,
} from 'mediasoup-client/types'

/**
 * Клиент → Сервер
 */
export interface VoiceClientToServerEvents {
  /**
   * Запрос RTP capabilities роутера
   * @param callback — RTP capabilities
   */
  getRtpCapabilities: (callback: (caps: RtpCapabilities) => void) => void

  /**
   * Создать транспорт для отправки (producer)
   * @param _      — пустой объект
   * @param callback — параметры транспорта для configureSendTransport()
   */
  createTransport: (
    _: Record<string, unknown>,
    callback: (params: {
      id: string
      iceParameters: IceParameters
      iceCandidates: IceCandidate[]
      dtlsParameters: DtlsParameters
    }) => void
  ) => void

  /**
   * Соединить транспорт producer с DTLS
   */
  connectTransport: (
    data: { transportId: string; dtlsParameters: DtlsParameters },
    callback: (error?: { error: string }) => void
  ) => void

  /**
   * Начать отправку (produce) аудио
   */
  produce: (
    data: { kind: MediaKind; rtpParameters: RtpParameters },
    callback: (response: { id: string } | { error: string }) => void
  ) => void

  /**
   * Запросить создание consumer
   */
  consume: (
    data: { producerId: string; rtpCapabilities: RtpCapabilities },
    callback: (
      response:
        | {
            user_id: string
            id: string
            producerId: string
            kind: MediaKind
            rtpParameters: RtpParameters
            transportId: string
            iceParameters: IceParameters
            iceCandidates: IceCandidate[]
            dtlsParameters: DtlsParameters
          }
        | { error: string }
    ) => void
  ) => void

  /**
   * Соединить транспорт consumer с DTLS
   */
  connectConsumerTransport: (
    data: { transportId: string; dtlsParameters: DtlsParameters },
    callback: (error?: { error: string }) => void
  ) => void
}

/**
 * Сервер → Клиент
 */
export interface VoiceServerToClientEvents {
  /**
   * К новому пользователю присоединился продюсер
   */
  existingProducers: (payload: { producerIds: string[] }) => void

  /**
   * Появился новый продюсер в комнате
   */
  newProducer: (payload: { producerId: string }) => void

  /**
   * У другого клиента подключён новый пользователь
   */
  userConnected: (payload: { userRoomId: string }) => void

  /**
   * Пользователь отключился
   */
  userDisconnected: (payload: { userRoomId: string }) => void
}
