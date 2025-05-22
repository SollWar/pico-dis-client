'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface PopoverMenuProps {
  trigger: ReactNode
  children: ReactNode
  position?: 'left' | 'right'
  isOpen: boolean
}

export default function PopoverMenu({
  trigger,
  children,
  position = 'left',
  isOpen = true,
}: PopoverMenuProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    if (isOpen) {
      setOpen((prev) => !prev)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block">
      <div ref={triggerRef} onClick={toggleMenu} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          ref={menuRef}
          className={`absolute w-48 bg-white border shadow-lg rounded z-50 ${
            position === 'right' ? 'right-0' : 'left-[32px]'
          }`}
        >
          {children}
        </div>
      )}
    </div>
  )
}
