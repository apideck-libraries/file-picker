import React, { FC, Fragment, HTMLAttributes, ReactElement, useState } from 'react'

import { Modal } from './Modal'
import { ModalContent } from './ModalContent'

export interface Props extends HTMLAttributes<HTMLDivElement> {
  // The component that should trigger the File Picker modal on click
  trigger: ReactElement
  // The JSON Web Token returned from the Session call
  jwt: string
}

/**
 * The Apideck File Picker
 */
export const FilePicker: FC<Props> = ({ trigger, jwt }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <Fragment>
      {React.cloneElement(trigger, { onClick: () => setIsOpen(true) })}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent jwt={jwt} />
      </Modal>
    </Fragment>
  )
}
