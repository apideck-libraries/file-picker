import FilesTable from './FilesTable'
import React from 'react'
import useSWR from 'swr'

interface Props {
  jwt: string
  serviceId: string
}

const FilesContainer = ({ jwt, serviceId }: Props) => {
  const getConnections = async (url: string) => {
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
    'https://unify.apideck.com/file-storage/files',
    getConnections
  )
  const isLoading = !files && !error

  const handleSelect = (file) => {
    console.log(file)
  }

  return <FilesTable data={files?.data} isLoading={isLoading} handleSelect={handleSelect} />
}

export default FilesContainer
