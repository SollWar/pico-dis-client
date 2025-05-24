'use client'
import * as mediasoupClient from 'mediasoup-client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useUserVoiceStore } from '../store/useUserVoiceStore'
import { useUserDataStore } from '../store/useUserDataStore'
import { MicVAD } from '@ricky0123/vad-web'
import { Producer } from 'mediasoup-client/types'
import { useUserSpeakStore } from '../store/useUserSpeakStore'

// STUN servers
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }]

// Signaling endpoint
const SIGNALING_URL = process.env.NEXT_PUBLIC_API_URL + '/api/voice'

interface VoiceProps {
  roomId: string
}

export default function Voice({ roomId }: VoiceProps) {
  // Refs for transports, producer, device, socket
  const socketRef = useRef<Socket>(null)
  const deviceRef = useRef<mediasoupClient.Device | null>(null)
  const sendTransportRef = useRef<ReturnType<
    mediasoupClient.Device['createSendTransport']
  > | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const producerRef = useRef<Producer>(null)
  const connectSound = useRef<HTMLAudioElement | null>(null)
  const disconnectSound = useRef<HTMLAudioElement | null>(null)

  const micVADRef = useRef<MicVAD | null>(null)
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false)
  const [isVolMuted, setIsVolMuted] = useState<boolean>(false)
  const streamRef = useRef<MediaStream>(null)
  const trackRef = useRef<MediaStreamTrack>(null)
  const sendTrackRef = useRef<MediaStreamTrack>(null)

  const audioContextRef = useRef<AudioContext>(null)
  const rnnoiseNodeRef = useRef<InstanceType<typeof window.RNNoiseNode>>(null)

  const { getRoomNameFromId, user } = useUserDataStore()
  const [roomName, setRoomName] = useState('')

  const { addConsumer, addGainNodes, clearAll } = useUserVoiceStore()

  const [vadLevel, setVadLevel] = useState<number>(0)

  const recvTransportsRef = useRef<mediasoupClient.types.Transport[]>([])
  const consumersRef = useRef<mediasoupClient.types.Consumer[]>([])
  const audioElementsRef = useRef<HTMLAudioElement[]>([])

  const { speakUsers, setSpeakUsers } = useUserSpeakStore()

  function visibilityHandler() {
    if (
      document.visibilityState === 'visible' &&
      audioContextRef.current?.state === 'suspended'
    ) {
      audioContextRef.current.resume().catch(console.warn)
    }
  }

  const toggleVolume = async () => {
    setIsVolMuted(!isVolMuted)
  }

  // Функция для переключения микрофона
  const toggleMicrophone = async () => {
    if (!trackRef.current) return

    try {
      if (isMicMuted) {
        // Включаем микрофон
        micVADRef.current?.start()
        sendTrackRef.current!.enabled = true
        setIsMicMuted(false)
      } else {
        // Отключаем микрофон
        micVADRef.current?.pause()
        sendTrackRef.current!.enabled = false
        setVadLevel(0)
        setIsMicMuted(true)
        socketRef.current?.emit('producerPaused', {
          userRoomId: roomId,
          userId: user?.id,
          paused: true,
        })
      }
    } catch (error) {
      console.error('Ошибка переключения микрофона:', error)
    }
  }

  const initializeAudioProcessing = async () => {
    try {
      //audioContextRef.current = new AudioContext({ sampleRate: 48000 })
      audioContextRef.current = new AudioContext({})
      await window.RNNoiseNode.register(audioContextRef.current)
      console.log('RNNoise успешно инициализирован')
    } catch (error) {
      console.error('Ошибка инициализации RNNoise:', error)
      throw error
    }
  }

  async function createTransport(
    params: {
      id: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      iceParameters: any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      iceCandidates: any[]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dtlsParameters: any
    },
    direction: 'send' | 'recv'
  ) {
    const transport =
      direction === 'send'
        ? deviceRef.current!.createSendTransport({
            ...params,
            iceServers: ICE_SERVERS,
          })
        : deviceRef.current!.createRecvTransport({
            ...params,
            iceServers: ICE_SERVERS,
          })

    // Регистрируем слушатель connect **до** produce/consume
    transport.on('connect', ({ dtlsParameters }, callback, errback) => {
      const event =
        direction === 'send' ? 'connectTransport' : 'connectConsumerTransport'
      socketRef.current!.emit(
        event,
        { transportId: transport.id, dtlsParameters },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err: any) => (err ? errback(err) : callback())
      )
    })

    if (direction === 'send') {
      transport.on('produce', async ({ kind, rtpParameters }, callback) => {
        try {
          const { id } = await new Promise<{ id: string }>((resolve) =>
            socketRef.current!.emit('produce', { kind, rtpParameters }, resolve)
          )
          callback({ id })
        } catch (err) {
          console.log(err)
        }
      })
    }

    return transport
  }

  // Initialize socket, device, and signaling handlers
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return

    setRoomName(getRoomNameFromId(roomId))

    connectSound.current = new Audio('/user_connect.wav')
    disconnectSound.current = new Audio('/user_disconnect.wav')

    // Configure volumes
    connectSound.current.volume = 0.3
    disconnectSound.current.volume = 0.3

    // 1. Connect to socket.io

    console.log(roomId)

    const socket: Socket = io(SIGNALING_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      auth: { roomId },
    })
    socketRef.current = socket

    // Main initialization
    async function initDevice() {
      try {
        socket.on('connect', async () => {
          await initializeAudioProcessing()

          // 2. Get RTP capabilities from server
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rtpCapabilities = await new Promise<any>((resolve) =>
            socket.emit('getRtpCapabilities', resolve)
          )

          // 3. Load mediasoup device
          const { Device } = await import('mediasoup-client')
          const device = new Device()
          await device.load({ routerRtpCapabilities: rtpCapabilities })
          deviceRef.current = device

          // 4. Signaling handlers
          socket.on('userConnected', ({ userRoomId }) => {
            console.log(userRoomId)
            if (userRoomId === roomId) {
              connectSound.current!.play().catch(() => {})
            }
          })
          socket.on('userDisconnected', ({ userRoomId, userId }) => {
            if (userRoomId === roomId) {
              disconnectSound.current!.play().catch(() => {})
              setSpeakUsers(userId, true)
              console.log(userId)
            }
          })
          socket.on('producerPaused', ({ userRoomId, userId, paused }) => {
            if (userRoomId === roomId) {
              setSpeakUsers(userId, paused)
            }
          })

          socket.on(
            'existingProducers',
            ({ producerIds }: { producerIds: string[] }) => {
              producerIds.forEach(createConsumer)
            }
          )
          socket.on('newProducer', ({ producerId }: { producerId: string }) => {
            createConsumer(producerId)
          })

          await startBroadcast()
        })
      } catch (err) {
        console.error('initDevice error:', err)
      }
    }

    // Consumer creation
    async function createConsumer(producerId: string) {
      try {
        // Skip our own
        if (producerRef.current && producerRef.current.id === producerId) return

        const device = deviceRef.current!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const consumeParams = await new Promise<any>((resolve) =>
          socket.emit(
            'consume',
            {
              producerId,
              rtpCapabilities: device.rtpCapabilities,
            },
            resolve
          )
        )
        if (consumeParams.error) {
          console.warn('Consume error:', consumeParams.error)
          return
        }

        const {
          transportId,
          iceParameters,
          iceCandidates,
          dtlsParameters,
          id: consumerId,
          kind,
          rtpParameters,
          producerId: pid,
        } = consumeParams

        const recvTransport = await createTransport(
          { id: transportId, iceParameters, iceCandidates, dtlsParameters },
          'recv'
        )

        recvTransportsRef.current.push(recvTransport)

        const consumer = await recvTransport.consume({
          id: consumerId,
          producerId: pid,
          kind,
          rtpParameters,
        })

        consumersRef.current.push(consumer)

        const ctx = audioContextRef.current!
        const mediaStream = new MediaStream([consumer.track]) // создаём один раз

        const source = ctx.createMediaStreamSource(mediaStream)
        const gainNode = ctx.createGain()
        gainNode.gain.value = 1
        source.connect(gainNode).connect(ctx.destination)

        //const audio = new Audio()
        //audio.srcObject = new MediaStream([consumer.track])
        //await audio.play()

        const audio = new Audio()
        audio.srcObject = mediaStream
        //await audio.play()
        audioElementsRef.current.push(audio)

        // сохраняем GainNode для изменения громкости
        addConsumer({ user_id: consumeParams.user_id, id: consumerId, gain: 1 })
        addGainNodes(consumerId, gainNode)
        // gainNodesRef.current[consumerId] = gainNode
        // setConsumers((prev) => [...prev, { id: consumerId, gain: 1 }])
      } catch (err) {
        console.error('createConsumer error:', err)
      }
    }

    // Kick off initialization
    initDevice()

    // Cleanup on unmount
    return () => {
      if (streamRef) {
        if (streamRef.current) {
          endCall()
        }
      }
      socket.disconnect()
    }
  }, [])

  // Handler for “Start Broadcast”
  const startBroadcast = async () => {
    if (sendTransportRef.current) {
      console.log('Send transport already exists')
      return
    }
    const socket = socketRef.current!
    try {
      // 1. Create transport on server
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sendParams = await new Promise<any>((resolve) =>
        socket.emit('createTransport', {}, resolve)
      )

      const sendTransport = await createTransport(sendParams, 'send')
      sendTransportRef.current = sendTransport

      // 2. Get audio track and produce
      // Захват аудиопотока
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: { ideal: 1 },
          noiseSuppression: { ideal: true },
          echoCancellation: { ideal: false },
          autoGainControl: { ideal: false },
          // sampleRate: { ideal: 48000 },
        },
      })

      streamRef.current = stream // Сохраняем поток
      const track = stream.getAudioTracks()[0]
      trackRef.current = track // Сохраняем трек
      const source = audioContextRef.current!.createMediaStreamSource(
        new MediaStream([track])
      )

      document.addEventListener('visibilitychange', visibilityHandler)

      rnnoiseNodeRef.current = new window.RNNoiseNode(audioContextRef.current!)
      source.connect(rnnoiseNodeRef.current)
      // 1. Создаем выходной поток для WebRTC
      const destination =
        audioContextRef.current!.createMediaStreamDestination()
      rnnoiseNodeRef.current.connect(destination)

      // 2. Берем трек из destination (этот трек будет отправляться через transport)
      const sendTrack = destination.stream.getAudioTracks()[0]
      sendTrackRef.current = sendTrack

      //let speechFrames = 0
      let silenceFrames = 0
      //const MIN_SPEECH_FRAMES = 1
      const MIN_SILENCE_FRAMES = 16

      const vad = await MicVAD.new({
        frameSamples: 256,
        minSpeechFrames: 0,
        onFrameProcessed: (probabilities) => {
          const vadProb = probabilities.isSpeech
          const vadLevel = vadProb * 100
          setVadLevel(vadLevel)

          if (vadLevel >= 4) {
            //speechFrames++
            silenceFrames = 0
          } else {
            silenceFrames++
            //speechFrames = 0
          }

          if (silenceFrames >= MIN_SILENCE_FRAMES) {
            producerRef.current?.pause()
            socketRef.current?.emit('producerPaused', {
              userRoomId: roomId,
              userId: user?.id,
              paused: true,
            })
            //sendTrack.enabled = false
          } else if (vadLevel >= 4) {
            producerRef.current?.resume()
            socketRef.current?.emit('producerPaused', {
              userRoomId: roomId,
              userId: user?.id,
              paused: false,
            })
            //sendTrack.enabled = true
          }
        },
      })

      micVADRef.current = vad

      vad.start()

      // 6. Отправляем трек в серверный транспорт (sendTrack вместо оригинального трека)
      const producer = await sendTransport.produce({
        track: sendTrack, // <-- Используем обработанный трек
      })
      producerRef.current = producer
      connectSound.current?.play().catch(() => {})
    } catch (err) {
      console.error('startBroadcast error:', err)
    }
  }

  const endCall = async () => {
    try {
      console.log('End')

      // 1. Уничтожаем VAD
      micVADRef.current?.destroy()
      micVADRef.current = null

      // 2. Останавливаем и сбрасываем все HTMLAudioElement
      audioElementsRef.current.forEach((a) => {
        a.pause()
        a.srcObject = null
      })
      audioElementsRef.current = []

      // 3. Закрываем все recvTransports и consumers
      recvTransportsRef.current.forEach((t) => t.close())
      consumersRef.current.forEach((c) => c.close())
      recvTransportsRef.current = []
      consumersRef.current = []

      // 4. Очищаем стор
      clearAll()

      // 5. Останавливаем локальный стрим и producer/sendTransport
      trackRef.current?.stop()
      streamRef.current?.getTracks().forEach((t) => t.stop())
      sendTransportRef.current?.close()
      producerRef.current?.close()

      // 6. Отключаем RNNoise и закрываем AudioContext
      rnnoiseNodeRef.current?.disconnect()
      rnnoiseNodeRef.current = null
      await audioContextRef.current?.close()
      audioContextRef.current = null

      // 7. Убираем все прослушиватели
      socketRef.current?.off()
      document.removeEventListener('visibilitychange', visibilityHandler)

      // 8. Отключаемся от socket.io
      socketRef.current?.disconnect()
      socketRef.current = null
    } catch (error) {
      console.error('Ошибка завершения:', error)
    }
  }

  return (
    <div className="flex h-[30px] flex-1 border-1 justify-between items-center ">
      <div className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis ms-0.5">
        <div
          style={{
            width: `${vadLevel.toFixed(0)}%`,
            background: 'green',
          }}
        >
          {roomName}
        </div>
      </div>
      <div className="flex justify-end">
        <button className=" cursor-pointer" onClick={toggleMicrophone}>
          {isMicMuted ? (
            <Image
              src="/mic_off.svg"
              alt="Включить микрофон"
              width={26}
              height={26}
            />
          ) : (
            <Image
              style={{
                background: producerRef.current?.paused ? 'white' : 'green',
              }}
              className=" bg-[green] rounded-2xl"
              src="/mic_on.svg"
              alt="Выключить микрофон"
              width={26}
              height={26}
            />
          )}
        </button>
        <button className=" cursor-pointer" onClick={toggleVolume}>
          {isVolMuted ? (
            <Image
              src="/vol_off.svg"
              alt="Включить звук"
              width={26}
              height={26}
            />
          ) : (
            <Image
              src="/vol_on.svg"
              alt="Выключить звук"
              width={26}
              height={26}
            />
          )}
        </button>
      </div>
    </div>
  )
}
