import React from 'react'

const columns = [
  {
    Header: 'Name'
  },
  {
    Header: 'Size'
  },
  {
    Header: 'Updated'
  }
]

export const LoadingTable = () => {
  const array = Array.from(Array(6).keys())

  return (
    <div className="overflow-auto">
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
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {array.map((_, i) => (
            <LoadingRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const LoadingRow = () => {
  return (
    <tr>
      {columns.map((_, i) => (
        <td
          className="py-4 space-x-6 text-sm font-medium truncate whitespace-nowrap"
          key={`cell-${i}`}
          style={{ maxWidth: 100 }}
        >
          <span className="px-16 py-0 bg-gray-200 rounded-sm animate-pulse"></span>
        </td>
      ))}
    </tr>
  )
}

export default LoadingTable
