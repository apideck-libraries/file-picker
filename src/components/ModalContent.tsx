import React, { FC, useEffect, useState } from 'react'

import { ApideckVault } from '@apideck/vault-js'
import useSWR from 'swr'
import { Connection } from '../types/Connection'
import { File } from '../types/File'
import { ToastProvider } from '../utils/useToast'
import FilesContainer from './FilesContainer'
import SelectConnection from './SelectConnection'

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
   * The function that gets called when a file is selected
   */
  onSelect: (file: File) => any

  /**
   * The function that gets called when a connection is selected
   */
  onConnectionSelect: (connection: Connection) => any
  /**
   * Title shown in the modal
   */
  title?: string
  /**
   * Subtitle shown in the modal
   */
  subTitle?: string
  /**
   * File to save. Forces the FilePicker to go in "Upload" mode and select the folder to upload the provided file
   */
  fileToSave: File
}

/**
 * The Apideck File Picker
 */
export const ModalContent: FC<Props> = ({
  appId,
  consumerId,
  jwt,
  onSelect,
  onConnectionSelect,
  title,
  subTitle,
  fileToSave
}) => {
  const [connection, setConnection] = useState<Connection>()
  const [isLoadingVault, setIsLoadingVault] = useState(false)

  const getConnections = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-apideck-consumer-id': consumerId,
        'x-apideck-app-id': appId,
        'x-apideck-auth-type': 'JWT',
        Authorization: `Bearer ${jwt}`
      }
    })
    return await response.json()
  }

  const { data, error, mutate } = useSWR(
    `https://unify.apideck.com/vault/connections?api=file-storage`,
    getConnections,
    {
      shouldRetryOnError: false
    }
  )
  const isLoading = !data && !error
  const hasError = data?.error || error
  const connections = data?.data
  const callableConnections = connections?.filter(
    (connection: Connection) => connection.state === 'callable'
  )

  useEffect(() => {
    if (!connection && callableConnections?.length) {
      setConnection(callableConnections[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setConnection, callableConnections])

  useEffect(() => {
    if (connection) {
      onConnectionSelect(connection)
    }
  }, [connection])

  const modalHeight = document.getElementById('modal-component')?.clientHeight

  return (
    <div className="relative -m-6 bg-white sm:rounded-lg h-modal" style={{ height: '34rem' }}>
      <div className="flex items-center justify-between px-4 py-5 sm:px-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
          <p className="max-w-2xl mt-1 text-sm text-gray-500">
            {hasError ? (
              <span className="mb-2 text-red-600">{hasError}</span>
            ) : (
              <span className="text-gray-700 dark:text-gray-400">
                {connection ? subTitle : 'No connector selected'}
              </span>
            )}
          </p>
        </div>
        <SelectConnection
          jwt={jwt}
          connections={connections}
          connection={connection}
          setConnection={setConnection}
          mutate={mutate}
          isLoading={isLoading}
        />
      </div>
      <div
        className="px-4 py-5 overflow-y-auto border-t border-gray-200 sm:px-6"
        style={{
          height:
            typeof window !== 'undefined' && modalHeight ? modalHeight - 70 : 'calc(100% - 70px)'
        }}
      >
        {connection ? (
          <ToastProvider>
            <FilesContainer
              appId={appId}
              consumerId={consumerId}
              jwt={jwt}
              onSelect={onSelect}
              connections={callableConnections}
              connection={connection}
              setConnection={setConnection}
              fileToSave={fileToSave}
            />
          </ToastProvider>
        ) : !callableConnections?.length && !isLoading ? (
          <div className="flex items-center justify-center border-2 border-gray-200 border-dashed rounded-lg h-96 empty">
            <div className="text-center">
              {hasError === 'Unauthorized' ? (
                <p className="text-gray-700 text-sm">Your session is invalid</p>
              ) : (
                <>
                  <button
                    className={`text-indigo-600 hover:text-indigo-900 ${
                      isLoadingVault && 'animate-pulse'
                    }`}
                    onClick={() => {
                      setIsLoadingVault(true)
                      ApideckVault.open({
                        token: jwt,
                        unifiedApi: 'file-storage',
                        onReady: () => setIsLoadingVault(false),
                        onClose: () => mutate()
                      })
                    }}
                  >
                    {isLoadingVault ? 'Loading...' : 'Open Vault'}
                  </button>{' '}
                  to add file storage connectors
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
