import React from 'react'
import { columns } from './TableColumns'

export const LoadingTable = () => {
  const array = Array.from(Array(20).keys())

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          {columns.map((column: any, i: number) => (
            <th
              key={`column-${i}`}
              className="py-3 space-x-6 text-xs font-medium tracking-wide text-left text-gray-500 uppercase"
            >
              {column.Header}
            </th>
          ))}
          <th scope="col" className="relative px-6 py-3">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {array.map((_, i) => (
          <LoadingRow key={i} />
        ))}
      </tbody>
    </table>
  )
}

export const LoadingRow = () => {
  return (
    <tr>
      {columns.map((_, i) => (
        <td
          className="py-4 space-x-6 text-sm font-medium truncate whitespace-nowrap"
          key={`cell-${i}`}
          style={{ maxWidth: 200 }}
        >
          <span className="px-16 py-0 bg-gray-200 rounded-sm animate-pulse"></span>
        </td>
      ))}
      <td className="max-w-xs px-1 py-2 text-sm font-medium text-right truncate whitespace-nowrap">
        <span className="px-4 py-0 bg-gray-200 rounded-sm animate-pulse"></span>
      </td>
    </tr>
  )
}

export default LoadingTable
