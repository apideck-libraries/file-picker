import React, { FC, HTMLAttributes, useState } from 'react'

import { Modal } from './Modal'
import { ModalContent } from './ModalContent'

export interface Props extends HTMLAttributes<HTMLDivElement> {
  /** The JSON Web Token returned from the Session call */
  jwt: string
}

/**
 * The Apideck File Picker
 */
export const FilePicker: FC<Props> = ({ jwt }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Pick file</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent jwt={jwt} />
      </Modal>
    </div>
  )
}
