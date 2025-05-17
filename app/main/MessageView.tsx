import { Message } from '../types'

interface MessageProps {
  message: Message
  currentUserId: string
}

const formatPostgresDate = (dateString: string): string => {
  const date = new Date(dateString) // Преобразуем строку в Date

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
    .format(date)
    .replace(',', '') // Убираем запятую для ru-RU
}

const MessageView = ({ message, currentUserId }: MessageProps) => {
  const textColor = currentUserId === message.user_id ? 'white' : 'black'
  const backColor = currentUserId === message.user_id ? '#2B7FFF' : '#EFF3F6'
  return (
    <div className="flex flex-row h-fit m-2 mb-1 mt-1">
      <div className="w-[48px] h-[48px] ms-1 me-1 bg-gray-500 flex-shrink-0"></div>
      <div
        className={`flex flex-col overflow-hidden p-2 w-full bg-[${backColor}]`}
      >
        <div className="flex flex-row items-baseline pe-2">
          <div className={`text-[16px] font-semibold text-${textColor}`}>
            {message.user_id}
          </div>
          <div className={`ms-1.5 text-[10px] text-${textColor}`}>
            {formatPostgresDate(message.created_at.toString())}
          </div>
        </div>
        <div className={`break-words mt-0.5 text-${textColor}`}>
          {message.content}
        </div>
      </div>
    </div>
  )
}

export default MessageView
