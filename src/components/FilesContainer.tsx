import React, { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react'

import Breadcrumbs from './Breadcrumbs'
import { Connection } from '..'
import { File } from '../types/File'
import FileDetails from './FileDetails'
import FilesTable from './FilesTable'
import LoadingTable from './LoadingTable'
import SaveFileForm from './SaveFileForm'
import Search from './Search'
import SlideOver from './SlideOver'
import Spinner from './Spinner'
import UploadButton from './UploadButton'
import { Waypoint } from 'react-waypoint'
import fetch from 'isomorphic-unfetch'
import { useDebounce } from '../utils/useDebounce'
import { useDropzone } from 'react-dropzone'
import { usePrevious } from '../utils/usePrevious'
import useSWRInfinite from 'swr/infinite'
import { useUpload } from '../utils/useUpload'

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
   * The JSON Web Token returned from the Create Session call
   */
  jwt: string
  /**
   * The function that gets called when a file is selected
   */
  onSelect: (file: File) => any
  /**
   * The available (callable) connections
   */
  connections: Connection[]
  /**
   * The currently active connection
   */
  connection: Connection
  /**
   * The function to update the active connection
   */
  setConnection: Dispatch<SetStateAction<Connection | undefined>>
  /**
   * File to save. Forces the FilePicker to go in "Upload" mode and select the folder to upload the provided file
   */
  fileToSave: File
}

const FilesContainer = ({
  appId,
  consumerId,
  jwt,
  onSelect,
  connections,
  connection,
  setConnection,
  fileToSave
}: Props) => {
  const [folderId, setFolderId] = useState<null | string>(null)
  const [folders, setFolders] = useState<File[]>([])
  const [file, setFile] = useState<null | File>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<File[]>()
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm)
  const serviceId = connection.service_id
  const prevServiceId = usePrevious(serviceId)
  const prevFolderId = usePrevious(folderId)
  const searchMode = !!debouncedSearchTerm?.length
  const headers = {
    'Content-Type': 'application/json',
    'x-apideck-auth-type': 'JWT',
    'x-apideck-app-id': appId,
    'x-apideck-consumer-id': consumerId,
    'x-apideck-service-id': serviceId,
    Authorization: `Bearer ${jwt}`
  }

  const fetcher = async (url: string): Promise<any> => {
    const response = await fetch(url, { headers })
    return await response.json()
  }

  const getKey = (pageIndex: number, previousPage: any) => {
    // If we switch from connector we want the folder ID to always be root
    const id = (prevServiceId && prevServiceId !== serviceId) || !folderId ? 'root' : folderId
    const filterParams = id === 'shared' ? 'filter[shared]=true' : `filter[folder_id]=${id}`
    const fileUrl = `https://unify.apideck.com/file-storage/files?limit=30&${filterParams}`

    if (previousPage && !previousPage?.data?.length) return null
    if (pageIndex === 0) return `${fileUrl}#serviceId=${serviceId}`

    const cursor = previousPage?.meta?.cursors?.next

    // We add the serviceId to the end of the URL so SWR caches the request results per service
    return `${fileUrl}&cursor=${cursor}#serviceId=${serviceId}`
  }

  const { data, setSize, size, error, mutate } = useSWRInfinite(getKey, fetcher, {
    shouldRetryOnError: false
  })

  const {
    uploadFile,
    isLoading: isUploading,
    progress
  } = useUpload({
    onSuccess: () => {
      mutate()
      hideDropzone()
    }
  })

  const onDrop = async (acceptedFiles: any) => {
    await uploadFile({ file: acceptedFiles[0], folderId, appId, consumerId, serviceId, jwt })
    hideDropzone()
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const nextPage = () => {
    const nextCursor = data?.length && data[data.length - 1]?.meta?.cursors?.next

    if (nextCursor) {
      setSize(size + 1)
    }
  }

  const hideDropzone = () => {
    const dropzoneElement = document.querySelector<HTMLElement>('.dropzone')
    if (dropzoneElement?.style?.visibility) dropzoneElement.style.visibility = 'hidden'
    if (dropzoneElement?.style?.opacity) dropzoneElement.style.opacity = '0'
  }

  const showDropzone = () => {
    const dropzoneElement = document.querySelector<HTMLElement>('.dropzone')
    if (dropzoneElement?.style) dropzoneElement.style.visibility = 'visible'
    if (dropzoneElement?.style) dropzoneElement.style.opacity = '1'
  }

  useEffect(() => {
    let lastTarget: EventTarget | null = null

    const onEnter = function (e: DragEvent) {
      lastTarget = e.target // cache the last target here
      showDropzone()
    }

    const onLeave = function (e: DragEvent) {
      if (e.target === lastTarget || e.target === document) {
        hideDropzone()
      }
    }

    const addDragListeners = () => {
      window.addEventListener('dragenter', onEnter)
      window.addEventListener('dragleave', onLeave)
    }

    const cleanupListeners = () => {
      window.removeEventListener('dragenter', onEnter)
      window.removeEventListener('dragleave', onLeave)
    }

    addDragListeners()
    return () => cleanupListeners()
  }, [])

  useEffect(() => {
    // If we switch from connector we want the folder ID to always be root except when we are in search mode
    if ((prevServiceId && prevServiceId !== serviceId && prevFolderId === folderId) || !folderId) {
      setFolderId('root')
      setFolders([])
    }
  }, [serviceId, prevServiceId])

  const handleSelect = (file: File) => {
    if (file.type === 'folder') {
      setFolderId(file.id)
      if (searchMode) {
        setSearchTerm('')
        setIsSearchVisible(false)
        setFolders([file])
        // When clicking a folder in search mode, we want to change the selected connection if the folder is from a different service
        if (file.connection?.service_id !== serviceId) {
          setConnection(file.connection)
        }
      } else {
        setFolders([...folders, file])
      }
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

  const filesError = error || (data?.length && data[data.length - 1]?.error)
  const isLoading = !data && !error
  const isLoadingMore = size > 0 && data && typeof data[size - 1] === 'undefined'

  let files = data?.length ? data.map((page) => page?.data).flat() : data ? [data] : []

  // Add Google Drive shared folder to root
  if ((!folderId || folderId === 'root') && data?.length && serviceId === 'google-drive') {
    const sharedFolder = { id: 'shared', name: 'Shared with me', type: 'folder' }
    if (files?.length) {
      files = [sharedFolder, ...files]
    } else {
      files.push(sharedFolder)
    }
  }

  useEffect(() => {
    if (debouncedSearchTerm?.length) {
      setIsSearching(true)

      const searchFiles = async (serviceId: string) => {
        const url = 'https://unify.apideck.com/file-storage/files/search'
        const options = {
          headers: { ...headers, 'x-apideck-service-id': serviceId },
          method: 'POST',
          body: JSON.stringify({ query: debouncedSearchTerm })
        }

        const response = await fetch(url, options)
        return response.json()
      }

      // Search across all callable connections
      const promises = connections.map((con) => searchFiles(con.service_id))

      Promise.all(promises)
        .then((responses) => {
          const results = responses
            ?.map((res: any) =>
              res?.data?.map((file: File) => {
                return {
                  ...file,
                  connection: connections.find((con) => con.service_id === res?.service)
                }
              })
            )
            .flat()

          // Make sure the search results of the currently active connection are first
          const currentConnectionResults = results.filter(
            (file) => file.connection?.service_id === connection.service_id
          )
          const rest = results.filter(
            (file) => file.connection?.service_id !== connection.service_id
          )
          setSearchResults([...currentConnectionResults, ...rest])
        })
        .finally(() => setIsSearching(false))
    }
  }, [debouncedSearchTerm, serviceId])

  const hasFiles = searchMode ? searchResults?.length : files?.length

  return (
    <Fragment>
      <div
        className="relative flex items-center justify-between mb-2"
        data-testid="files-container"
      >
        <Breadcrumbs folders={folders} handleClick={handleBreadcrumbClick} />
        <div className="flex items-center space-x-2">
          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isSearchVisible={isSearchVisible}
            setIsSearchVisible={setIsSearchVisible}
          />
          {!fileToSave ? (
            <UploadButton
              file={fileToSave}
              consumerId={consumerId}
              jwt={jwt}
              folderId={folderId}
              serviceId={serviceId}
              appId={appId}
              onSuccess={mutate}
            />
          ) : null}
        </div>
      </div>
      {isLoading || isSearching ? <LoadingTable isSearching={isSearching} /> : null}
      <div {...getRootProps()} className="relative">
        <input {...getInputProps()} />
        {isDragActive || isUploading ? (
          <div
            className="flex justify-center px-6 py-24 mt-4 border-2 border-gray-300 border-dashed rounded-md"
            data-testid="loading"
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Spinner className="w-6 h-6 text-gray-500" />
                {progress !== null ? (
                  <div className="w-full h-2 mt-4 bg-gray-200 rounded" style={{ width: 200 }}>
                    <div
                      className={`h-2 bg-blue-400 rounded ${progress === 100 && 'animate-ping'} `}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative bg-white rounded-md">
                    <span>Drop here to upload to</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1 font-medium text-indigo-600">{connection.name}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {folders.length ? `Folder: ${folders[folders.length - 1]?.name}` : 'Root folder'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 invisible w-full h-96 dropzone" />
        )}
      </div>
      {!isLoading && !isSearching && hasFiles && !filesError && !isDragActive && !isUploading ? (
        <FilesTable
          data={searchMode && searchResults ? searchResults : files}
          handleSelect={handleSelect}
          isLoadingMore={isLoadingMore}
          searchMode={searchMode}
          uploadingMode={!!fileToSave}
        />
      ) : null}
      {!isLoading && !isSearching && !hasFiles ? (
        <p className="py-4 text-sm text-center text-gray-700">No files found</p>
      ) : null}
      {!isLoading ? (
        <SlideOver open={!!file}>
          <FileDetails file={file} setFile={setFile} onSelect={onSelect} />
        </SlideOver>
      ) : null}
      {!isLoading && filesError ? (
        <p className="mt-2 text-sm text-red-600">{filesError?.message || filesError}</p>
      ) : null}
      {files?.length && !isLoadingMore && !searchMode ? (
        <div className="flex flex-row-reverse py-4 border-gray-200">
          <Waypoint onEnter={() => nextPage()} />
        </div>
      ) : null}
      {fileToSave && (
        <SaveFileForm
          file={fileToSave}
          appId={appId}
          consumerId={consumerId}
          jwt={jwt}
          folderId={folderId}
          serviceId={serviceId}
          onSuccess={onSelect}
        />
      )}
    </Fragment>
  )
}

export default FilesContainer
