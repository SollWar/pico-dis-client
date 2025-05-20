'use client'
import * as mediasoupClient from 'mediasoup-client'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

// STUN servers
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]

// Signaling endpoint
const SIGNALING_URL = 'http://localhost:3001/api/voice'

export default function VoicePage() {
  // Refs for transports, producer, device, socket
  const socketRef = useRef<Socket>(null)
  const deviceRef = useRef<mediasoupClient.Device | null>(null)
  const sendTransportRef = useRef<ReturnType<
    mediasoupClient.Device['createSendTransport']
  > | null>(null)
  const producerRef = useRef<any>(null)
  const connectSound = useRef<HTMLAudioElement | null>(null)
  const disconnectSound = useRef<HTMLAudioElement | null>(null)

  const audioContextRef = useRef<AudioContext>(null)
  const rnnoiseNodeRef = useRef<InstanceType<typeof window.RNNoiseNode>>(null)

  const initializeAudioProcessing = async () => {
    try {
      audioContextRef.current = new AudioContext({ sampleRate: 48000 })
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
      iceParameters: any
      iceCandidates: any[]
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
        (err: any) => (err ? errback(err) : callback())
      )
    })

    if (direction === 'send') {
      transport.on(
        'produce',
        async ({ kind, rtpParameters }, callback, errback) => {
          try {
            const { id } = await new Promise<{ id: string }>((resolve) =>
              socketRef.current!.emit(
                'produce',
                { kind, rtpParameters },
                resolve
              )
            )
            callback({ id })
          } catch (err) {
            console.log(err)
          }
        }
      )
    }

    return transport
  }

  // Audio cues

  // State to force re-render if needed
  const [, setReady] = useState(false)

  // Initialize socket, device, and signaling handlers
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return

    connectSound.current = new Audio('/user_connect.wav')
    disconnectSound.current = new Audio('/user_disconnect.wav')

    // Configure volumes
    connectSound.current.volume = 0.3
    disconnectSound.current.volume = 0.3

    // 1. Connect to socket.io
    const socket = io(SIGNALING_URL)
    socketRef.current = socket

    // Main initialization
    async function initDevice() {
      try {
        await initializeAudioProcessing()
        // 2. Get RTP capabilities from server
        const rtpCapabilities = await new Promise<any>((resolve) =>
          socket.emit('getRtpCapabilities', resolve)
        )

        // 3. Load mediasoup device
        const { Device } = await import('mediasoup-client')
        const device = new Device()
        await device.load({ routerRtpCapabilities: rtpCapabilities })
        deviceRef.current = device

        // 4. Signaling handlers
        socket.on('userConnected', () =>
          connectSound.current!.play().catch(() => {})
        )
        socket.on('userDisconnected', () =>
          disconnectSound.current!.play().catch(() => {})
        )

        socket.on(
          'existingProducers',
          ({ producerIds }: { producerIds: string[] }) => {
            producerIds.forEach(createConsumer)
          }
        )
        socket.on('newProducer', ({ producerId }: { producerId: string }) => {
          createConsumer(producerId)
        })

        // Trigger a render so UI knows we’re ready
        setReady((r) => !r)
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

        const consumer = await recvTransport.consume({
          id: consumerId,
          producerId: pid,
          kind,
          rtpParameters,
        })

        const audio = new Audio()
        audio.srcObject = new MediaStream([consumer.track])
        await audio.play()
      } catch (err) {
        console.error('createConsumer error:', err)
      }
    }

    // Kick off initialization
    initDevice()

    // Cleanup on unmount
    return () => {
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
          noiseSuppression: { ideal: false },
          echoCancellation: { ideal: true },
          autoGainControl: { ideal: false },
          sampleRate: { ideal: 48000 },
        },
      })

      const track = stream.getAudioTracks()[0]
      const source = audioContextRef.current!.createMediaStreamSource(
        new MediaStream([track])
      )

      rnnoiseNodeRef.current = new window.RNNoiseNode(audioContextRef.current!)
      source.connect(rnnoiseNodeRef.current)

      const destination =
        audioContextRef.current!.createMediaStreamDestination()
      rnnoiseNodeRef.current.connect(destination)

      // Индикатор VAD(Детектор голоса)?
      rnnoiseNodeRef.current.onstatus = (data) => {
        const vadProbElement = document.getElementById('vadProb')
        if (vadProbElement) {
          vadProbElement.style.width = data.vadProb * 100 + '%'
        }
      }

      // Анимационный цикл
      const updateLoop = () => {
        requestAnimationFrame(() => {
          rnnoiseNodeRef.current?.update(true)
          updateLoop()
        })
      }
      updateLoop()

      const producer = await sendTransport.produce({
        track: destination.stream.getAudioTracks()[0],
      })
      producerRef.current = producer
      connectSound.current!.play().catch(() => {})
    } catch (err) {
      console.error('startBroadcast error:', err)
    }
  }

  return (
    <div className="h-[34px] w-[165px] border-1">
      <Script src="/rnnoise-runtime.js" strategy="beforeInteractive" />
      <button className="h-[26px] bg-amber-300" onClick={startBroadcast}>
        On
      </button>
    </div>
  )
}
