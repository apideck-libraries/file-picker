import React, { Fragment, ReactNode } from 'react'

import { Transition } from '@headlessui/react'

interface Props {
  open: boolean
  close: () => void
  title?: string
  children: ReactNode
}

export default function SlideOver({ open, close, title, children }: Props) {
  return (
    <Transition show={open} as={Fragment}>
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl"
        style={{ width: 'calc(100% - 3rem)', left: '1.5rem' }}
      >
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
        >
          <div className="relative w-full rounded-t-2xl">
            <div className="flex flex-col h-full py-6 overflow-y-auto bg-white border border-gray-200 rounded-t-lg shadow-sm">
              <div className="relative flex-1 px-4 sm:px-6">{children}</div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  )
}
