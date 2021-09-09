import React, { CSSProperties, useEffect, useState } from 'react'

import { Transition } from '@headlessui/react'
import { createPortal } from 'react-dom'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onClose: () => void
  isOpen: boolean
  className?: string
  style?: CSSProperties
}

export const Modal = React.forwardRef<HTMLDivElement, Props>(function Modal(props, ref) {
  const { children, onClose, isOpen, className = '', style = {}, ...other } = props

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const modalComponent = (
    <Transition show={isOpen}>
      <Transition.Child
        enter="transition ease-out duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="fixed inset-0 z-40 flex items-end bg-gray-400 bg-opacity-75 dark:bg-gray-600 sm:items-center sm:justify-center"
          data-testid="backdrop"
          onClick={onClose}
        >
          <Transition.Child
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 transform translate-y-1/4 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0  transform translate-y-1/4 scale-95"
            className={`w-full p-5 overflow-y-scroll bg-white dark:bg-gray-800 dark-text-gray-400 shadow-lg rounded-t-lg sm:p-6 no-scrollbar sm:rounded-lg sm:m-4 sm:max-w-xl ${className}`}
            style={{ maxHeight: '90%', ...style }}
            ref={ref}
            role="dialog"
            onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()}
            {...other}
          >
            {children}
          </Transition.Child>
        </div>
      </Transition.Child>
    </Transition>
  )

  return mounted ? createPortal(modalComponent, document.body) : null
})
