import React from 'react'
import { formatBytes } from '../utils/bytesToSize'

interface Props {
  file: any
  setFile: any
}

const FileDetails = ({ file, setFile }: Props) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Name</dt>
          <dd className="mt-1 text-sm text-gray-900">{file?.name}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Size</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {file?.size ? formatBytes(file?.size) : '-'}
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Mime type</dt>
          <dd className="mt-1 text-sm text-gray-900">{file?.mime_type}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Downloadable</dt>
          <dd className="mt-1 text-sm text-gray-900">{file?.downloadable ? 'Yes' : 'No'}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Created</dt>
          <dd className="mt-1 text-sm text-gray-900">
            <div>
              <span className="mr-2 text-gray-900">
                {new Date(file?.created_at).toLocaleDateString()}
              </span>
              <span className="text-gray-500 ">
                {new Date(file?.created_at).toLocaleTimeString()}
              </span>
            </div>
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Updated</dt>
          <dd className="mt-1 text-sm text-gray-900">
            <div>
              <span className="mr-2 text-gray-900">
                {new Date(file?.updated_at).toLocaleDateString()}
              </span>
              <span className="text-gray-500 ">
                {new Date(file?.updated_at).toLocaleTimeString()}
              </span>
            </div>
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Owner</dt>
          <dd className="mt-1 text-sm text-gray-900">{file?.owner?.name}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Email</dt>
          <dd className="mt-1 text-sm text-gray-900">{file?.owner?.email}</dd>
        </div>
      </dl>
      <div className="flex justify-between pt-6">
        <button
          type="button"
          className="w-full mr-3 items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setFile(null)}
        >
          Close
        </button>
        <button
          type="button"
          className="w-full ml-3 items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => console.log(file)}
        >
          Select File
        </button>
      </div>
    </div>
  )
}

export default FileDetails
