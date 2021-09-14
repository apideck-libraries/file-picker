import React, { Fragment, useState } from 'react'
import useSWR from 'swr'
import { File } from '../types/File'
import Breadcrumbs from './Breadcrumbs'
import FileDetails from './FileDetails'
import FilesTable from './FilesTable'
import LoadingTable from './LoadingTable'
import SlideOver from './SlideOver'

interface Props {
  /**
   * The ID of your Unify application
   */
  appId: string
  /**
   * The ID of the consumer which you want to fetch files from
   */
  consumerId: string
  /**
   * The ID of the selected connector, for example "google-drive"
   */
  serviceId: string
  /**
   * The JSON Web Token returned from the Create Session call
   */
  jwt: string
  /**
   * The function that gets called when a file is selected
   */
  onSelect: (file: File) => any
}

const FilesContainer = ({ appId, consumerId, jwt, serviceId, onSelect }: Props) => {
  const [folderId, setFolderId] = useState<null | string>('root')
  const [folders, setFolders] = useState<File[]>([])
  const [file, setFile] = useState<null | File>(null)

  const getFiles = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-apideck-auth-type': 'JWT',
        'x-apideck-app-id': appId,
        'x-apideck-consumer-id': consumerId,
        'x-apideck-service-id': serviceId,
        Authorization: `Bearer ${jwt}`
      }
    })
    return await response.json()
  }

  const { data: files, error } = useSWR(
    `https://unify.apideck.com/file-storage/files?filter${
      folderId === 'shared' ? '[shared]=true' : `[folder_id]=${folderId}`
    }`,
    getFiles
  )

  const isLoading = !files && !error

  const handleSelect = (file: File) => {
    if (file.type === 'folder') {
      setFolderId(file.id)
      setFolders([...folders, file])
    }

    if (file.type === 'file') {
      setFile(file)
    }
  }

  const handleBreadcrumbClick = (file?: File) => {
    if (file) {
      setFolderId(file.id)
      const index = folders.indexOf(file)
      const newArray = [...folders.slice(0, index + 1)]
      setFolders(newArray)
    } else {
      setFolderId('root')
      setFolders([])
    }
  }

  const filesError = error || files?.error
  const filesData =
    folderId === 'root' && files?.data
      ? [{ id: 'shared', name: 'Shared with me', type: 'folder' }, ...files?.data]
      : files?.data

  return (
    <Fragment>
      <Breadcrumbs folders={folders} handleClick={handleBreadcrumbClick} />
      {isLoading ? <LoadingTable /> : <FilesTable data={filesData} handleSelect={handleSelect} />}
      {!isLoading ? (
        <SlideOver open={!!file}>
          <FileDetails file={file} setFile={setFile} onSelect={onSelect} />
        </SlideOver>
      ) : null}
      {!isLoading && error && <p className="text-red-600">{filesError?.message || filesError}</p>}
    </Fragment>
  )
}

export default FilesContainer
