'use client'
import { useEffect, useState } from 'react'
import Category from './Category'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import 'overlayscrollbars/styles/overlayscrollbars.css'
import { findRoomById, Room, RoomType } from '../types'
import { useTextRoom } from '../hook/useTextRoom'
import { useUserDataStore } from '../store/useUserDataStore'
import { useRouter, useSearchParams } from 'next/navigation'
import TextRoom from './TextRoom'
import Modal from '../components/Modal'
import CreateRoomModal from './CreateRoomModal'
import Voice from '../components/Voice'
import Script from 'next/script'

const MainPage = () => {
  const router = useRouter()
  const { rooms, user, usersInVoiceRooms } = useUserDataStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { setRoom, messages, sendMessage } = useTextRoom()
  const [createRoomModal, setCreateRoomModal] = useState(false)
  const [voiceRoomId, setVoiceRoomId] = useState<string | null>(null)
  const [pendingRoomId, setPendingRoomId] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const roomIdParams = searchParams.get('id')
  const room = findRoomById(rooms, roomIdParams)

  const createRoom = () => {
    setCreateRoomModal(true)
  }

  const callbackCrateRoomModal = () => {
    setCreateRoomModal(false)
  }

  const handleVoiceToggle = (id: string) => {
    if (voiceRoomId === id) {
      setVoiceRoomId(null) // выход
      console.log('exit')
    } else if (!voiceRoomId) {
      setVoiceRoomId(id) // вход
      console.log('connect')
    } else {
      // Переключение — сначала отключаем
      setVoiceRoomId(null)
      setPendingRoomId(id)
      console.log('switch')
    }
  }

  // "догружаем" новый ID после размонтирования
  useEffect(() => {
    if (voiceRoomId === null && pendingRoomId) {
      const timeout = setTimeout(() => {
        setVoiceRoomId(pendingRoomId)
        setPendingRoomId(null)
      }, 0) // 0 или 50мс, если нужно точно дождаться размонтирования

      return () => clearTimeout(timeout)
    }
  }, [voiceRoomId, pendingRoomId])

  const roomClick = (id: string, type: string) => {
    console.log(voiceRoomId)
    if (type === 'text') {
      if (roomIdParams !== id) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('id', id)
        router.push(`/?${params.toString()}`)
      }
    }
    if (type === 'voice') {
      handleVoiceToggle(id)
    }
  }

  const switchSide = () => {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    if (roomIdParams) {
      setRoom(roomIdParams)
    }
  }, [roomIdParams])

  return (
    <div>
      <CreateRoomModal
        isOpen={createRoomModal}
        onClose={() => {
          setCreateRoomModal(false)
        }}
        callback={() => callbackCrateRoomModal()}
      />
      <div className="h-screen flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-50            /* оверлей на малых экранах */
          w-[250px] bg-[#EFF3F6] border-r border-gray-300
          transform transition-transform duration-300
          ${
            sidebarOpen
              ? 'min-[700px]:relative min-[700px]:translate-x-0 min-[700px]:inset-0 min-[700px]:transform-none'
              : '-translate-x-full'
          }
          /* → на экранах ≥700px: всегда на месте */
          
          h-screen overflow-y-auto 
        `}
        >
          <OverlayScrollbarsComponent
            className="h-full overlay-theme"
            options={{
              scrollbars: {
                visibility: 'auto', // показывать, только когда нужно
                autoHide: 'never', // не скрывать по умолчанию
              },
            }}
          >
            <div className="flex flex-col">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center">
                  <div className="w-[26px] h-[26px] m-1 bg-gray-500"></div>
                  <div className="ms-2 text-[20px]">{user?.login}</div>
                </div>
                {voiceRoomId ? <Voice roomId={voiceRoomId} /> : ''}
                {sidebarOpen ? (
                  <button
                    className="w-[18px] h-[26px] m-1 bg-gray-500 cursor-pointer"
                    onClick={switchSide}
                  ></button>
                ) : (
                  ''
                )}
              </div>
              <div className="mt-1">
                <Category
                  onClick={(id, type) => roomClick(id, type)}
                  rooms={rooms as Room[]}
                  selectedId={roomIdParams!}
                  roomType={'text'}
                  usersInVoiceRooms={null}
                />
                <Category
                  onClick={(id, type) => roomClick(id, type)}
                  rooms={rooms as Room[]}
                  selectedId={roomIdParams!}
                  roomType={'voice'}
                  usersInVoiceRooms={usersInVoiceRooms}
                />
              </div>
              <button
                onClick={createRoom}
                className="h-[34px] mb-0.5 ms-2.5 me-2.5 flex items-center border-1 cursor-pointer"
              >
                Создать конал
              </button>
            </div>
          </OverlayScrollbarsComponent>
        </aside>

        {/* Main content */}
        <main className="flex flex-1 flex-col bg-white ">
          {/* Верхний фиксированный блок */}
          <div className="flex flex-col ms-1.5 mb-1.5 flex-shrink-0">
            <div className="flex flex-row items-center">
              {sidebarOpen ? (
                ''
              ) : (
                <button
                  className="w-[18px] h-[26px] m-1 bg-gray-500 cursor-pointer"
                  onClick={switchSide}
                ></button>
              )}
              <div className="flex items-center w-[26px] h-[26px] m-1 text-[20px]">
                {room?.name ?? 'MiniDis'}
              </div>
            </div>
          </div>

          {/* Контейнер сообщений с прокруткой */}
          {room && (
            <TextRoom
              send={(content) => sendMessage(content)}
              currentUserId={user?.id as string}
              messages={messages}
            />
          )}
          {/* Нижний фиксированный блок (поле ввода) */}
        </main>
      </div>
    </div>
  )
}

export default MainPage
