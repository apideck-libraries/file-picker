import React, { Fragment } from 'react'

import { Transition } from '@headlessui/react'

export default function SlideOver({ open, close, title, children }) {
  return (
    <Transition show={open} as={Fragment}>
      <div
        className="absolute right-0 left-0 bottom-0 rounded-t-2xl"
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
            <div className="h-full flex flex-col py-6 bg-white border border-gray-200 shadow-sm overflow-y-auto rounded-t-lg">
              <div className="relative flex-1 px-4 sm:px-6">{children}</div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  )
}
