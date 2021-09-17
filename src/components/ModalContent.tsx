import React, { FC, useEffect, useState } from 'react'
import useSWR from 'swr'
import { Connection } from '../types/Connection'
import { File } from '../types/File'
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
   * Title shown in the modal
   */
  title?: string
  /**
   * Subtitle shown in the modal
   */
  subTitle?: string
}

/**
 * The Apideck File Picker
 */
export const ModalContent: FC<Props> = ({ appId, consumerId, jwt, onSelect, title, subTitle }) => {
  const [connection, setConnection] = useState<Connection>()

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

  const { data, error } = useSWR(
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

  return (
    <div className="-m-6 bg-white sm:rounded-lg h-modal" style={{ height: '34rem' }}>
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
          isLoading={isLoading}
        />
      </div>
      <div className="h-full px-4 py-5 overflow-y-auto border-t border-gray-200 sm:px-6">
        {connection ? (
          <FilesContainer
            appId={appId}
            consumerId={consumerId}
            serviceId={connection.service_id}
            jwt={jwt}
            onSelect={onSelect}
          />
        ) : !callableConnections?.length && !isLoading ? (
          <div className="flex items-center justify-center border-2 border-gray-200 border-dashed rounded-lg h-96">
            <div className="text-center">
              <a
                href={`https://vault.apideck.com/session/${jwt}`}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:text-indigo-900"
              >
                Go to vault
              </a>{' '}
              to add file storage connectors
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
