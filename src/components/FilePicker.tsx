import '../styles/tailwind.css'

import React, { Fragment, ReactElement, createContext, forwardRef, useState } from 'react'

import { File } from '../types/File'
import { Modal } from './Modal'
import { ModalContent } from './ModalContent'

export interface Props {
  /**
   * The ID of your Unify application
   */
  appId: string
  /**
   * The ID of the consumer which you want to fetch files from
   */
  consumerId: string
  /**
   * The JSON Web Token returned from the Create Session call
   */
  jwt: string
  /**
   * The component that should trigger the File Picker modal on click
   */
  trigger: ReactElement
  /**
   * The function that gets called when a file is selected
   */
  onSelect: (file: File) => any
}

export const EventsContext = createContext({ onSelect: undefined })

/**
 * The Apideck File Picker component
 */
export const FilePicker = forwardRef<HTMLElement, Props>(function FilePicker(
  { appId, consumerId, jwt, trigger, onSelect },
  ref
) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleFileSelect = (file: File) => {
    onSelect(file)
    setIsOpen(false)
  }

  return (
    <Fragment>
      {React.cloneElement(trigger, { onClick: () => setIsOpen(true), ref })}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent appId={appId} consumerId={consumerId} jwt={jwt} onSelect={handleFileSelect} />
      </Modal>
    </Fragment>
  )
})
