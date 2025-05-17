'use client'
import { useEffect, useState } from 'react'
import Category from './Category'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import 'overlayscrollbars/styles/overlayscrollbars.css'
import { findRoomById, Room } from '../types'
import { useTextRoom } from '../hook/useTextRoom'
import { useUserDataStore } from '../store/useStore'
import { useRouter, useSearchParams } from 'next/navigation'
import TextRoom from './TextRoom'

const MainPage = () => {
  const router = useRouter()
  const { rooms, user } = useUserDataStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { setRoom, messages, sendMessage } = useTextRoom()
  const switchSide = () => {
    setSidebarOpen(!sidebarOpen)
  }
  const searchParams = useSearchParams()
  const roomIdParams = searchParams.get('id')
  const room = findRoomById(rooms, roomIdParams)
  const testClick = (id: string) => {
    if (roomIdParams !== id) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('id', id)
      router.push(`/?${params.toString()}`)
    }
  }

  useEffect(() => {
    if (roomIdParams) {
      setRoom(roomIdParams)
    }
  }, [roomIdParams])

  return (
    <div>
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
              <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center">
                  <div className="w-[26px] h-[26px] m-1 bg-gray-500"></div>
                  <div className="ms-2 text-[20px]">{user?.login}</div>
                </div>
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
                  onClick={(id) => testClick(id)}
                  rooms={rooms as Room[]}
                  roomType={'text'}
                />
              </div>
              <div className="h-[34px] mb-0.5 ms-2.5 me-2.5 flex items-center border-1 cursor-pointer">
                Создать комнату
              </div>
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
