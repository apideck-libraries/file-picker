import React, { FC, HTMLAttributes, useEffect, useState } from 'react'
import useSWR from 'swr'
import { Connection } from '../types/Connection'
import Files from './Files'
import SelectConnection from './SelectConnection'


export interface Props extends HTMLAttributes<HTMLDivElement> {
  /** The JSON Web Token returned from the Session call */
  jwt: string
}

/**
 * The Apideck File Picker
 */
export const ModalContent: FC<Props> = ({ jwt }) => {
  const [connection, setConnection] = useState<Connection>()

  const getConnections = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-apideck-consumer-id': 'test-consumer-ckgrs95l3y4er0b99qa37buj2',
        'x-apideck-app-id': 'cfaZrORgaH2PMQpIcjTpfhERIpIEUJHev09ucjTp',
        'x-apideck-auth-type': 'JWT',
        Authorization: `Bearer ${jwt}`
      }
    })
    return await response.json()
  }

  const { data: connections, error } = useSWR(
    `https://unify.apideck.com/vault/connections`,
    getConnections
  )
  const isLoading = !connections && !error
  const callableConnections = connections?.data?.filter(
    (connection: Connection) =>
      connection.state === 'callable' && connection.unified_api === 'file-storage'
  )

  useEffect(() => {
    if (!connection && callableConnections?.length) {
      setConnection(callableConnections[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setConnection, callableConnections])

  return (
    <div className="-m-6 overflow-hidden bg-white sm:rounded-lg">
      <div className="flex items-center justify-between px-4 py-5 sm:px-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Apideck Filepicker</h3>
          <p className="max-w-2xl mt-1 text-sm text-gray-500">
            <span className="text-gray-700 dark:text-gray-400">
              {connection ? 'Pick a file' : 'Select connector'}
            </span>
          </p>
        </div>
        <SelectConnection
          jwt={jwt}
          connections={callableConnections}
          connection={connection}
          setConnection={setConnection}
          isLoading={isLoading}
        />
      </div>
      <div className="px-4 py-5 border-t border-gray-200 sm:px-6">
        <div className="py-4">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex justify-center items-center">
            {!callableConnections?.length && !isLoading ? (
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
            ) : (
              <Files serviceId={connection?.service_id}>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
