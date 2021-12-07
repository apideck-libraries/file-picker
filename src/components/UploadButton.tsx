import React from 'react'
import Spinner from './Spinner'
import { useUpload } from '../utils/useUpload'

const UploadButton = ({ folderId, appId, consumerId, serviceId, jwt, onSuccess }: any) => {
  const { uploadFile, isLoading } = useUpload({ onSuccess })

  return (
    <div className="">
      <label htmlFor="file-upload" className="cursor-pointer">
        {isLoading ? (
          <Spinner className="w-5 h-5 text-gray-400" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-400 transition duration-150 hover:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        )}
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          onChange={(e: any) =>
            uploadFile({ file: e.target?.files[0], folderId, appId, consumerId, serviceId, jwt })
          }
        />
      </label>
    </div>
  )
}

export default UploadButton
