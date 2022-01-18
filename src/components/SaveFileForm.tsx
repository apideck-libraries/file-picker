import React, { ChangeEvent, useState } from 'react'

import { useUpload } from '../utils/useUpload'

const SaveFileForm = ({ file, folderId, appId, consumerId, serviceId, jwt, onSuccess }: any) => {
  const [fileName, setFileName] = useState(file.name)
  const { uploadFile, isLoading } = useUpload({ onSuccess })

  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-white border-t"
      data-testid="file-to-save-form"
    >
      <div className="flex items-center justify-center p-4">
        <input
          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border border-gray-200 rounded shadow-sm appearance-none focus:outline-none focus:shadow-outline"
          name="fileName"
          placeholder="File name"
          autoComplete="off"
          onChange={(event: ChangeEvent<HTMLInputElement>) => setFileName(event.target.value)}
          value={fileName}
        />
        <button
          type="button"
          className="items-center px-3 py-2 ml-2 text-sm font-medium leading-4 text-white bg-blue-600 border border-transparent rounded-md shadow-sm whitespace-nowrap sm:ml-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() =>
            uploadFile({
              file: { ...file, name: fileName },
              folderId,
              appId,
              consumerId,
              serviceId,
              jwt
            })
          }
        >
          {isLoading ? 'Uploading...' : 'Save file'}
        </button>
      </div>
    </div>
  )
}

export default SaveFileForm
