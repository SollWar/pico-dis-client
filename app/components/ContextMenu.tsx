'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface PopoverMenuProps {
  trigger: ReactNode
  children: ReactNode
  position?: 'left' | 'right'
}

export default function PopoverMenu({
  trigger,
  children,
  position = 'left',
}: PopoverMenuProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setOpen((prev) => !prev)

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
          className={`absolute mt-2 w-48 bg-white border shadow-lg rounded z-50 ${
            position === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {children}
        </div>
      )}
    </div>
  )
}
