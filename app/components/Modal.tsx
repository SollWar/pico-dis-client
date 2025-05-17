import React from 'react'
import clsx from 'clsx'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className: string
  closeButton: boolean
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  closeButton,
}) => {
  if (!isOpen) return null

  return (
    <div
      className={clsx(
        'fixed w-full h-[102%] bg-[rgba(0,0,0,0.5)]',
        'flex items-center justify-center z-[1000] left-0 top-0',
        className
      )}
      onClick={onClose}
    >
      <div
        className="relative max-w-[500px] w-[90%] p-5 bg-[#ffffff]"
        onClick={(e) => e.stopPropagation()}
      >
        {' '}
        {closeButton ? (
          <button
            className="absolute text-2xl cursor-pointer border-[none] right-[15px] top-2.5 bg-[transparent]"
            onClick={onClose}
          >
            ×
          </button>
        ) : (
          ''
        )}
        {children}
      </div>
    </div>
  )
}

export default Modal
