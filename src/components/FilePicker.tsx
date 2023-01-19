import jwtDecode from 'jwt-decode'
import React, {
  Fragment,
  ReactElement,
  createContext,
  forwardRef,
  useEffect,
  useState
} from 'react'
import { Connection, File } from '../types'
import { Modal } from './Modal'
import { ModalContent } from './ModalContent'

export interface Props {
  /**
   * The JSON Web Token returned from the Create Session call
   */
  token: string
  /**
   * The function that gets called when a file is selected
   */
  onSelect?: (file: File) => any
  /**
   * The function that gets called when a connection is selected
   */
  onConnectionSelect?: (connection: Connection) => any
  /**
   * The component that should trigger the File Picker modal on click
   */
  trigger?: ReactElement
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
  /**
   * Opens the file picker if set to true
   */
  open?: boolean
  /**
   * Callback function that gets called when the modal is closed
   */
  onClose?: () => any
  /**
   * File to save. Forces the FilePicker to go in "Upload" mode and only
   * allows to change the file name and select the folder to upload the provided file to
   */
  fileToSave?: File | any
}

export const EventsContext = createContext({ onSelect: undefined })

const SESSION_MESSAGE = `Make sure you first create a session and then provide the returned token to the component. https://developers.apideck.com/apis/vault/reference#operation/sessionsCreate`
const INVALID_TOKEN_MESSAGE = `Invalid token provided to React Vault. ${SESSION_MESSAGE}`
const NO_TOKEN_MESSAGE = `No token provided to React Vault. ${SESSION_MESSAGE}`

/**
 * The Apideck File Picker component
 */
export const FilePicker = forwardRef<HTMLElement, Props>(function FilePicker(
  {
    token,
    trigger,
    onSelect,
    onConnectionSelect,
    title,
    subTitle,
    showAttribution = true,
    open = false,
    onClose,
    fileToSave
  },
  ref
) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [decodedToken, setDecodedToken] = useState<any>(null)

  const handleFileSelect = (file: File) => {
    let fileToReturn = file
    if (file.connection) {
      const { connection, ...rest } = file
      fileToReturn = rest
    }
    if (onSelect) onSelect(fileToReturn)
    onCloseModal()
  }

  const handleConnectionSelect = (connection: Connection) => {
    if (onConnectionSelect) onConnectionSelect(connection)
  }

  const onCloseModal = () => {
    setIsOpen(false)
    if (onClose) {
      onClose()
    }
  }

  useEffect(() => {
    if (open) {
      setIsOpen(true)
    }
  }, [open])

  useEffect(() => {
    if (token?.length) {
      let decoded

      try {
        decoded = jwtDecode<{ application_id: string; consumer_id: string }>(token)
        console.log(decoded)
        setDecodedToken(decoded)
      } catch (e) {
        console.error(e)
        console.error(INVALID_TOKEN_MESSAGE)
        setDecodedToken(null)
      }
    }
  }, [token])

  return (
    <Fragment>
      {trigger ? React.cloneElement(trigger, { onClick: () => setIsOpen(true), ref }) : null}
      <Modal isOpen={isOpen} onClose={() => onCloseModal()} showAttribution={showAttribution}>
        <ModalContent
          appId={decodedToken?.application_id}
          consumerId={decodedToken?.consumer_id}
          jwt={token}
          onSelect={handleFileSelect}
          onConnectionSelect={handleConnectionSelect}
          title={title ? title : fileToSave ? 'Apideck File Uploader' : 'Apideck File Picker'}
          subTitle={subTitle ? subTitle : fileToSave ? 'Select a folder' : 'Select a file'}
          fileToSave={fileToSave}
        />
      </Modal>
    </Fragment>
  )
})
