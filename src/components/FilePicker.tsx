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
  /**
   * Title shown in the modal
   */
  title?: string
  /**
   * Subtitle shown in the modal
   */
  subTitle?: string
  /**
   * Show powered by Apideck in the modal backdrop
   */
  showAttribution?: boolean
}

export const EventsContext = createContext({ onSelect: undefined })

/**
 * The Apideck File Picker component
 */
export const FilePicker = forwardRef<HTMLElement, Props>(function FilePicker(
  {
    appId,
    consumerId,
    jwt,
    trigger,
    onSelect,
    title = 'Apideck File Picker',
    subTitle = 'Select a file',
    showAttribution = true
  },
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
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} showAttribution={showAttribution}>
        <ModalContent
          appId={appId}
          consumerId={consumerId}
          jwt={jwt}
          onSelect={handleFileSelect}
          title={title}
          subTitle={subTitle}
        />
      </Modal>
    </Fragment>
  )
})
