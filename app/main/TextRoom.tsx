'use client'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import MessageView from './MessageView'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Message } from '../types'
import LoadingScreen from '../components/Loading'

interface TextRoomProps {
  messages: Message[] | null
  currentUserId: string
  send: (content: string) => void
}

const TextRoom = ({ messages, currentUserId, send }: TextRoomProps) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' })
    }
  }

  // Скроллим при изменении сообщений
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  return (
    <>
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
          <div className="flex flex-col">
            {messages ? (
              messages.map((message, index) => (
                <MessageView
                  key={index}
                  currentUserId={currentUserId}
                  message={message}
                />
              ))
            ) : (
              <LoadingScreen />
            )}
            <div ref={messagesEndRef} />
          </div>
        </OverlayScrollbarsComponent>
      </div>
      <div className="flex-shrink-0 px-2.5 pb-2.5 mb-2.5">
        <div className="h-[42px]">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setInput('')
              send(input)
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
              <Image src="/send.svg" alt="Отправить" width={32} height={32} />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default TextRoom
