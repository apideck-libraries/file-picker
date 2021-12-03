import { useState } from 'react'
import { useToast } from './useToast'

interface Props {
  onSuccess: (response?: any) => void
}

interface UploadFileProps {
  file: File
  appId: string
  consumerId: string
  serviceId: string
  folderId: string
  jwt: string
}

export const useUpload = ({ onSuccess }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()

  const uploadFile = async ({
    file,
    appId,
    consumerId,
    serviceId,
    folderId,
    jwt
  }: UploadFileProps) => {
    const headers = {
      'x-apideck-auth-type': 'JWT',
      'x-apideck-app-id': appId,
      'x-apideck-consumer-id': consumerId,
      'x-apideck-service-id': serviceId,
      'x-apideck-metadata': JSON.stringify({
        name: file.name,
        parent_folder_id: folderId === 'root' ? '0' : folderId
      }),
      Authorization: `Bearer ${jwt}`
    }
    setIsLoading(true)
    try {
      const raw = await fetch('https://unify.apideck.com/file-storage/files', {
        headers,
        method: 'POST',
        body: file
      })
      const response = await raw.json()
      if (response.error) {
        addToast({
          title: 'Something went wrong',
          description: response.message,
          type: 'error',
          autoClose: true
        })
      } else {
        addToast({
          title: 'File uploaded',
          description: 'File successfully uploaded',
          type: 'success',
          autoClose: true
        })
        const fileDetails = await getFile(headers, response.data.id)
        onSuccess(fileDetails?.data || file)
      }
    } catch (error) {
      addToast({
        title: 'Something went wrong',
        description: error as string,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getFile = async (headers: any, fileId: string) => {
    const raw = await fetch(`https://unify.apideck.com/file-storage/files/${fileId}`, {
      headers
    })
    const response = await raw.json()
    return response
  }

  return { uploadFile, isLoading }
}
