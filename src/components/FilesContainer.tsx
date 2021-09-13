import React, { Fragment, useState } from 'react'

import Breadcrumbs from './Breadcrumbs'
import { File } from '../types/File'
import FileDetails from './FileDetails'
import FilesTable from './FilesTable'
import LoadingTable from './LoadingTable'
import SlideOver from './SlideOver'
import useSWR from 'swr'

interface Props {
  jwt: string
  serviceId: string
  onSelect: (file: File) => any
}

const FilesContainer = ({ jwt, serviceId, onSelect }: Props) => {
  const [folderId, setFolderId] = useState<null | string>('root')
  const [folders, setFolders] = useState<File[]>([])
  const [file, setFile] = useState<null | File>(null)

  const getFiles = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-apideck-consumer-id': 'test-consumer-ckgrs95l3y4er0b99qa37buj2',
        'x-apideck-app-id': 'cfaZrORgaH2PMQpIcjTpfhERIpIEUJHev09ucjTp',
        'x-apideck-auth-type': 'JWT',
        'x-apideck-service-id': serviceId,
        Authorization: `Bearer ${jwt}`
      }
    })
    return await response.json()
  }

  const { data: files, error } = useSWR(
    `https://unify.apideck.com/file-storage/files?filter[folderId]=${folderId}`,
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

  const fileError = error || files?.error

  return (
    <Fragment>
      <Breadcrumbs folders={folders} handleClick={handleBreadcrumbClick} />
      {isLoading ? <LoadingTable /> : <FilesTable data={files?.data} handleSelect={handleSelect} />}
      {!isLoading ? (
        <SlideOver open={!!file} close={() => setFile(null)} title={file?.name}>
          <FileDetails file={file} setFile={setFile} onSelect={onSelect} />
        </SlideOver>
      ) : null}
      {!isLoading && error && <p className="text-red-600">{fileError?.message || fileError}</p>}
    </Fragment>
  )
}

export default FilesContainer
