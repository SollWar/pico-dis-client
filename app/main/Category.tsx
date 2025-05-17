import { getRoomsByType, Room, RoomType } from '../types'

const roomTypeLabels: Record<RoomType, string> = {
  text: 'Текстовые каналы',
  voice: 'Голосовые каналы',
  personal: 'Личные сообщения',
}

interface CategoryProps {
  roomType: RoomType
  rooms: Room[]
  selectedId: string
  onClick: (id: string) => void
}

const getRoomTypeLabel = (type: RoomType): string => {
  return roomTypeLabels[type]
}

const Category = ({ roomType, rooms, selectedId, onClick }: CategoryProps) => {
  return (
    <div>
      <div className="h-[34px] mt-0.5 mb-0.5 ms-2.5 me-2.5 flex items-center border-1 cursor-pointer">
        {getRoomTypeLabel(roomType)}
      </div>
      {getRoomsByType(roomType, rooms).map((room) => (
        <button
          onClick={() => onClick(room.id)}
          style={{
            background: selectedId === room.id ? '#2B7FFF' : '',
            color: selectedId === room.id ? 'white' : '',
            border: 'solid 1px black',
          }}
          className="h-[34px] w-[219px] mt-0.5 mb-0.5 ms-5 me-2.5 flex items-center cursor-pointer"
          key={room.id}
        >
          {room.name}
        </button>
      ))}
    </div>
  )
}

export default Category
