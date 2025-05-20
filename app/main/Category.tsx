import { useUserDataStore } from '../store/useUserDataStore'
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
  usersInVoiceRooms: Record<string, string[]> | null
  onClick: (id: string, type: string) => void
}

const getRoomTypeLabel = (type: RoomType): string => {
  return roomTypeLabels[type]
}

const Category = ({
  roomType,
  rooms,
  selectedId,
  usersInVoiceRooms,
  onClick,
}: CategoryProps) => {
  const { user } = useUserDataStore()
  return (
    <div>
      <div className="h-[34px] mt-0.5 mb-0.5 ms-2.5 me-2.5 flex items-center border-1 cursor-pointer">
        {getRoomTypeLabel(roomType)}
      </div>
      {getRoomsByType(roomType, rooms).map((room) => (
        <div key={room.id}>
          <button
            onClick={() => onClick(room.id, room.type)}
            style={{
              background: selectedId === room.id ? '#2B7FFF' : '',
              color: selectedId === room.id ? 'white' : '',
              border: 'solid 1px black',
            }}
            className="h-[34px] w-[219px] mt-0.5 mb-0.5 ms-5 me-2.5 flex items-center cursor-pointer"
          >
            {room.name}
          </button>
          {usersInVoiceRooms
            ? Object.entries(usersInVoiceRooms).map(([roomId, users]) =>
                roomId === room.id
                  ? users.map((userId) => (
                      <button
                        key={roomId + userId}
                        style={{
                          background: userId === user?.id ? '#2B7FFF' : '',
                          color: userId === user?.id ? 'white' : '',
                        }}
                        className="border-1 h-[30px] w-[207px] mt-0.5 mb-0.5 ms-8 me-2.5 flex items-center cursor-pointer"
                      >
                        {userId}
                      </button>
                    ))
                  : ''
              )
            : ''}
        </div>
      ))}
    </div>
  )
}

export default Category
