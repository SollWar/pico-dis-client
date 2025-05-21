import { useIdsHelperStore } from '../store/useIdsHelperStore'
import { useUserDataStore } from '../store/useUserDataStore'
import { useUserVoiceStore } from '../store/useUserVoiceStore'
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
  const { consumers, changeGainNodes } = useUserVoiceStore()
  const { getLoginFromId } = useIdsHelperStore()

  const handleGainChange = (id: string, value: number) => {
    changeGainNodes(id, value)
  }
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
                      <div
                        className="mt-0.5 ms-8 me-2.5 border-1 w-[207px]"
                        style={{
                          height: userId === user?.id ? '30px' : '54px',
                          background: userId === user?.id ? '#2B7FFF' : '',
                          color: userId === user?.id ? 'white' : '',
                        }}
                        key={roomId + userId}
                      >
                        <button
                          style={{}}
                          className="flex items-center cursor-pointer"
                        >
                          {getLoginFromId(userId)}
                        </button>
                        {consumers?.map(({ user_id, id, gain }) =>
                          user_id === userId ? (
                            <div key={id} className="flex items-center">
                              <label htmlFor={`gain-${id}`}></label>
                              <input
                                id={`gain-${id}`}
                                type="range"
                                min={0}
                                max={5}
                                step={0.1}
                                value={gain}
                                onChange={(e) =>
                                  handleGainChange(id, +e.target.value)
                                }
                              />
                              <span>{(gain * 100).toFixed(0)}%</span>
                            </div>
                          ) : (
                            ''
                          )
                        )}
                      </div>
                    ))
                  : ''
              )
            : ''}
        </div>
      ))}
      <div className="space-y-4"></div>
    </div>
  )
}

export default Category
