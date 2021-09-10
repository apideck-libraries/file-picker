import React, { useState } from 'react'

import FileDetails from './FileDetails'
import FilesTable from './FilesTable'
import LoadingTable from './LoadingTable'
import SlideOver from './SlideOver'
import useSWR from 'swr'

interface Props {
  jwt: string
  serviceId: string
}

const FilesContainer = ({ jwt, serviceId }: Props) => {
  const [folderId, setFolderId] = useState()
  const [file, setFile] = useState()

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
    `https://unify.apideck.com/file-storage/files${
      folderId ? `?filter[folderId]=${folderId}` : ''
    }`,
    getFiles
  )

  const isLoading = !files && !error

  const handleSelect = (file) => {
    if (file.type === 'folder') {
      setFolderId(file.id)
    }

    if (file.type === 'file') {
      setFile(file)
    }
  }

  // const handleParentFolderSelect = (parentFolder) => {
  //   setFolderId(parentFolder?.id)
  // }

  // const parentFolders = files?.data?.length && files.data[0].parent_folders
  return (
    <>
      {/* {parentFolders?.length &&
        parentFolders.map((folder) => (
          <button onClick={() => handleParentFolderSelect(folder)}>{folder.id}</button>
        ))} */}
      {isLoading ? <LoadingTable /> : <FilesTable data={files?.data} handleSelect={handleSelect} />}

      {!isLoading ? (
        <SlideOver open={!!file} close={() => setFile(null)} title={file?.name}>
          <FileDetails file={file} setFile={setFile} />
        </SlideOver>
      ) : null}
    </>
  )
}

export default FilesContainer
