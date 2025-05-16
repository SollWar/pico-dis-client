'use client'
import { useEffect, useState } from 'react'
import { messages } from './Moke'
import Category from './Category'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import 'overlayscrollbars/styles/overlayscrollbars.css'
import MessageView from './MessageView'
import { Room } from '../types'
import { useGlobalLoader } from '../hook/useGlobalLoader'
import { useRooms } from '../hook/useRooms'
import { useUserStore } from '../store/useStore'

const MainPage = () => {
  const { rooms } = useUserStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [input, setInput] = useState('')
  const { roomClick } = useRooms()
  const switchSide = () => {
    setSidebarOpen(!sidebarOpen)
  }

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
                  <div className="ms-2 text-[20px]">Z3RG</div>
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
                  onClick={(id) => roomClick(id)}
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
                Спам
              </div>
            </div>
          </div>

          {/* Контейнер сообщений с прокруткой */}
          <div className="flex-1 min-h-0 overflow-hidden px-2.5 pb-2.5">
            <OverlayScrollbarsComponent
              className="h-full overlay-theme border-1 bg-white"
              options={{
                scrollbars: {
                  visibility: 'auto',
                  autoHide: 'scroll',
                },
              }}
            >
              <div className="flex flex-col-reverse">
                {messages.map((message, index) => (
                  <MessageView
                    key={index}
                    currentUserId={'1'}
                    message={message}
                  />
                ))}
              </div>
            </OverlayScrollbarsComponent>
          </div>

          {/* Нижний фиксированный блок (поле ввода) */}
          <div className="flex-shrink-0 px-2.5 pb-2.5 mb-2.5">
            <div className="h-[42px]">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                }}
                className="grid grid-cols-[1fr_auto] gap-2 w-full"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите сообщение..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white h-[42px] w-[42px] flex justify-center cursor-pointer"
                  disabled={false}
                >
                  <img src="/send.svg" alt="Отправить" width="32" height="32" />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainPage
