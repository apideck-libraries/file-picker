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
  folderId: string | null
  jwt: string
}

export const useUpload = ({ onSuccess }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
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
        parent_folder_id: folderId
      }),
      Authorization: `Bearer ${jwt}`
    }
    setIsLoading(true)
    setProgress(null)
    // if file bigger then 4mb then use multi part upload
    if (file.size > 4000000) {
      setProgress(5)
      await uploadLargeFile(file, headers, folderId)
    } else {
      await uploadRegularFile(file, headers)
    }
  }

  const uploadRegularFile = async (file: File, headers: Record<string, string>) => {
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
        const fileDetails = await getFile(response.data.id, headers)
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

  const getFile = async (fileId: string, headers: any) => {
    const raw = await fetch(`https://unify.apideck.com/file-storage/files/${fileId}`, {
      headers
    })
    const response = await raw.json()
    return response
  }

  const getPartSize = async (file: File, headers: any, folderId: string | null) => {
    try {
      const raw = await fetch('https://unify.apideck.com/file-storage/upload-sessions', {
        headers: { ...headers, 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          size: file.size,
          name: file.name,
          parent_folder_id: folderId
        })
      })
      const sessionResponse = await raw.json()
      const sessionId = sessionResponse.data?.id
      if (!sessionId) return { partSize: null, sessionId: null }

      const rawSession = await fetch(
        `https://unify.apideck.com/file-storage/upload-sessions/${sessionId}`,
        {
          headers: { ...headers, 'Content-Type': 'application/json' }
        }
      )
      const session = await rawSession.json()
      return { partSize: session.data?.part_size, sessionId }
    } catch (error) {
      console.log('Session error', error)
      return { partSize: null, sessionId: null }
    }
  }

  const uploadLargeFile = async (file: File, headers: any, folderId: string | null) => {
    try {
      const { partSize, sessionId } = await getPartSize(file, headers, folderId)
      let currentChunkStartByte = 0
      let currentChunkFinalByte = partSize > file.size ? file.size : partSize
      let index = 0

      const uploadChunk = async () => {
        const chunk = file.slice(currentChunkStartByte, currentChunkFinalByte)
        try {
          const raw = await fetch(
            `https://unify.apideck.com/file-storage/upload-sessions/${sessionId}?part_number=${index}`,
            {
              headers: { ...headers, 'Content-Type': file.type },
              method: 'PUT',
              body: chunk
            }
          )
          const response = await raw.json()
          if (response.error) {
            addToast({
              title: 'Something went wrong',
              description: response.message,
              type: 'error'
            })
            return
          }

          const remainingBytes = file.size - currentChunkFinalByte

          if (currentChunkFinalByte === file.size) {
            setProgress(100)
            // All chunks are uploaded. Finish the upload session.
            const result = await fetch(
              `https://unify.apideck.com/file-storage/upload-sessions/${sessionId}/finish`,
              {
                headers,
                method: 'POST'
              }
            )
            const finalResponse = await result.json()
            setIsLoading(false)
            addToast({
              title: 'File uploaded',
              description: 'File successfully uploaded',
              type: 'success',
              autoClose: true
            })
            onSuccess(finalResponse.data || file)
            return
          } else if (remainingBytes < partSize) {
            // Last chunk to upload
            currentChunkStartByte = currentChunkFinalByte
            currentChunkFinalByte = currentChunkStartByte + remainingBytes
          } else {
            // Next chunk to upload
            currentChunkStartByte = currentChunkFinalByte
            currentChunkFinalByte = currentChunkStartByte + partSize
          }
          index++
          setProgress((index / Math.ceil(file.size / partSize)) * 100)
          uploadChunk()
        } catch (error) {
          setIsLoading(false)
          addToast({
            title: 'Something went wrong',
            description: error as string,
            type: 'error'
          })
        }
      }

      console.log(`uploading ${Math.ceil(file.size / partSize)} chunks of ${partSize} bytes`)

      if (sessionId && partSize) {
        uploadChunk()
      }
    } catch (error) {
      console.log('Error', error)
    }
  }

  return { uploadFile, isLoading, progress }
}
