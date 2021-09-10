import React from 'react'
import { formatBytes } from '../utils/bytesToSize'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const columns: any[] = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: (props: any) => {
      const type = props.row.original.type
      if (type === 'folder') {
        return (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 inline-block mr-1 text-yellow-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            {props.value}
          </div>
        )
      }
      return (
        <div className="flex items-center">
          <svg viewBox="0 0 24 24" className="h-6 w-6 inline-block mr-1 text-gray-500">
            <path
              d="M17 6v12c0 .52-.2 1-1 1H4c-.7 0-1-.33-1-1V2c0-.55.42-1 1-1h8l5 5zM14 8h-3.13c-.51 0-.87-.34-.87-.87V4"
              stroke="currentColor"
              fill="none"
              fillRule="evenodd"
              strokeLinejoin="round"
            />
          </svg>

          {props.value}
        </div>
      )
    }
  },
  {
    Header: 'Size',
    accessor: 'size',
    Cell: ({ value }: { value: number }) => <div>{value ? formatBytes(value) : null}</div>
  },
  {
    Header: 'Updated',
    accessor: 'updated_at',
    Cell: ({ value }: { value: string }) => {
      const date = new Date(value)
      return (
        <span className="text-gray-900">{`${months[date.getMonth()]} ${date.getDay()}, ${new Date(
          value
        ).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}`}</span>
      )
    }
  }
]
