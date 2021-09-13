import React, { FC, Fragment, HTMLAttributes, ReactElement, createContext, useState } from 'react'

import { File } from '../types/File'
import { Modal } from './Modal'
import { ModalContent } from './ModalContent'

export interface Props extends HTMLAttributes<HTMLDivElement> {
  // The component that should trigger the File Picker modal on click
  trigger: ReactElement
  // The JSON Web Token returned from the Session call
  jwt: string
  // The function that gets called when a file is selected
  onSelect: (file: File) => any
}

export const EventsContext = createContext({ onSelect: undefined })

/**
 * The Apideck File Picker
 */
export const FilePicker: FC<Props> = ({ trigger, jwt, onSelect }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleFileSelect = (file: File) => {
    onSelect(file)
    setIsOpen(false)
  }

  return (
    <Fragment>
      {React.cloneElement(trigger, { onClick: () => setIsOpen(true) })}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent jwt={jwt} onSelect={handleFileSelect} />
      </Modal>
    </Fragment>
  )
}
