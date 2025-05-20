import { FormEvent, useEffect, useState } from 'react'
import Modal from '../components/Modal'
import { useMainSocketStore } from '../store/useMainSocketStore'

type CreateRoomModalProps = {
  isOpen: boolean
  onClose: () => void
  callback: () => void
}

const CreateRoomModal = ({
  isOpen,
  onClose,
  callback,
}: CreateRoomModalProps) => {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { socket } = useMainSocketStore()
  const [process, setProcess] = useState(false)

  const options = [
    { id: 'text', label: 'Текст' },
    { id: 'voice', label: 'Голос' },
  ]

  const [selectedType, setSelectedType] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (selectedType === '') {
      setError('Выберите тип')
      return
    }
    if (name === '') {
      setError('Введите название')
      return
    }
    setProcess(true)
    socket?.emit('createRoom', name, selectedType)
  }

  useEffect(() => {
    socket?.on('roomCreated', () => {
      callback()
      setProcess(false)
    })
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="" closeButton={true}>
      <div className="flex flex-col items-center">
        <div className="mt-4 mb-8 text-2xl">Создание канала</div>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="flex flex-col mb-1.5">
            <label htmlFor="type">Тип</label>
            {options.map((option) => (
              <label
                className="flex w-[280px] h-[38px] border-1 rounded-[5px] items-center mb-1"
                key={option.id}
              >
                <input
                  className="ms-1 me-1.5 w-[20px] h-[20px]"
                  type="radio"
                  value={option.id}
                  checked={selectedType === option.id}
                  onChange={() => setSelectedType(option.id)}
                />
                {option.label}
              </label>
            ))}
          </div>
          <div className="flex flex-col mb-6">
            <label htmlFor="name">Название</label>
            <input
              disabled={process}
              className="w-[280px] h-[38px] border-1 rounded-[5px]"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {error && <div className="mt-1.5 text-red-600">* {error}</div>}
          </div>

          <button
            style={{
              background: process ? 'gray' : '#2B7FFF',
              cursor: process ? 'progress' : 'pointer',
            }}
            disabled={process}
            className=" w-[280px] h-[38px] mb-14 rounded-[5px] text-white"
            type="submit"
          >
            {process ? 'Создание...' : 'Создать'}
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default CreateRoomModal
