import { Transition } from '@headlessui/react'
import React from 'react'
import { useSortBy, useTable } from 'react-table'
import { formatBytes } from '../utils/bytesToSize'
import { LoadingRow } from './LoadingTable'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
interface IProps {
  data: any[]
  isLoading?: boolean
  isLoadingMore?: boolean
  handleSelect: any
}

const FilesTable = ({ data = [], isLoadingMore, handleSelect }: IProps) => {
  const columns: any[] = React.useMemo(
    () => [
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
                  className="inline-block w-6 h-6 mr-1 text-yellow-300"
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
                <span className="truncate">{props.value}</span>
              </div>
            )
          }
          return (
            <div className="flex items-center truncate">
              <svg viewBox="0 0 24 24" className="inline-block w-6 h-6 mr-1 text-gray-500">
                <path
                  d="M17 6v12c0 .52-.2 1-1 1H4c-.7 0-1-.33-1-1V2c0-.55.42-1 1-1h8l5 5zM14 8h-3.13c-.51 0-.87-.34-.87-.87V4"
                  stroke="currentColor"
                  fill="none"
                  fillRule="evenodd"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="truncate">{props.value}</span>
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
          if (!value) return <span className="text-gray-900">-</span>
          const date = new Date(value)
          return (
            <span className="text-gray-900 ">{`${
              months[date.getMonth()]
            } ${date.getDay()}, ${new Date(value).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}`}</span>
          )
        }
      }
    ],
    []
  )

  const { getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data
    },
    useSortBy
  )

  return (
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="">
          {headerGroups.map((headerGroup: any, i: number) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup${i}`}>
              {headerGroup.headers.map((column: any, i: number) => (
                <th
                  key={`column-${i}`}
                  className="py-3 pr-2 space-x-6 text-xs font-medium tracking-wide text-left text-gray-500 uppercase"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="inline-block w-4 h-4 ml-2 text-gray-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="inline-block w-4 h-4 ml-2 text-gray-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      )
                    ) : (
                      ''
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
          {rows.map((row: any, i: number) => {
            prepareRow(row)

            return (
              <Transition
                show={true}
                enter="transition ease-out duration-300"
                enterFrom="transform opacity-40"
                enterTo="transform opacity-100"
                leave="transition ease-in duration-300"
                leaveFrom="transform opacity-100"
                leaveTo="transform opacity-0"
                as="tr"
                {...row.getRowProps()}
                key={`row-${i}`}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSelect(row.original)}
              >
                {row.cells.map((cell: any, i: number) => {
                  return (
                    <td
                      className="py-3 space-x-6 text-xs text-gray-900 truncate max-w-2xs whitespace-nowrap"
                      {...cell.getCellProps()}
                      key={`cell-${i}`}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </Transition>
            )
          })}
        </tbody>
      </table>
      {isLoadingMore ? (
        <table className="min-w-full divide-y divide-gray-200">
          {Array.from(Array(12).keys()).map((key) => (
            <LoadingRow key={key} />
          ))}
        </table>
      ) : (
        ''
      )}
    </div>
  )
}

export default FilesTable
