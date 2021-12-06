import { FilePicker, Props } from '../src/components/FilePicker'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

const meta: Meta = {
  title: 'FileSaver',
  component: FilePicker,
  argTypes: {
    children: {
      control: {
        type: 'text'
      }
    }
  },
  parameters: {
    controls: { expanded: true }
  }
}

export default meta

// First create a vault session to get a JSON Web Token
const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWRpcmVjdF91cmkiOiJodHRwczovL215c2Fhcy5jb20vZGFzaGJvYXJkIiwiY29uc3VtZXJfbWV0YWRhdGEiOnsiYWNjb3VudF9uYW1lIjoiU3BhY2VYIiwidXNlcl9uYW1lIjoiRWxvbiBNdXNrIiwiaW1hZ2UiOiJodHRwczovL3d3dy5zcGFjZXguY29tL3N0YXRpYy9pbWFnZXMvc2hhcmUuanBnIn0sInRoZW1lIjp7InZhdWx0X25hbWUiOiJJbnRlcmNvbSIsInByaW1hcnlfY29sb3IiOiIjMjg2ZWZhIiwic2lkZXBhbmVsX2JhY2tncm91bmRfY29sb3IiOiIjMjg2ZWZhIiwic2lkZXBhbmVsX3RleHRfY29sb3IiOiIjRkZGRkZGIiwiZmF2aWNvbiI6Imh0dHBzOi8vd3d3LmludGVyY29tLmNvbS9fbmV4dC9zdGF0aWMvaW1hZ2VzL2Zhdmljb24tMzQ4YWQ4ZGY2YzE2N2Q5M2ZiODk0ZThiY2I0ZGNkMmEucG5nIiwidGVybXNfdXJsIjoiaHR0cHM6Ly93d3cudGVybXNmZWVkLmNvbS90ZXJtcy1jb25kaXRpb25zLzk1N2M4NWMxYjA4OWFlOWUzMjE5YzgzZWZmNjUzNzdlIiwicHJpdmFjeV91cmwiOiJodHRwczovL2NvbXBsaWFuY2UuYXBpZGVjay5jb20vcHJpdmFjeS1wb2xpY3kifSwiY29uc3VtZXJfaWQiOiJ0ZXN0LWNvbnN1bWVyLWNrZ3JzOTVsM3k0ZXIwYjk5cWEzN2J1ajIiLCJhcHBsaWNhdGlvbl9pZCI6ImNmYVpyT1JnYUgyUE1RcEljalRwZmhFUklwSUVVSkhldjA5dWNqVHAiLCJzY29wZXMiOltdLCJpYXQiOjE2Mzg1NDUxMzYsImV4cCI6MTYzODU0ODczNn0.SRFBmQNCa9qLPZxLxaF93lckVJeCkRm1pM5DvpBBYXY'

const Template: Story<Props> = (args) => {
  const [file, setFile] = useState<File>()
  return (
    <div className="flex items-center">
      {file ? (
        <span className="mr-2 italic">{file.name}</span>
      ) : (
        <label htmlFor="file-upload" className="cursor-pointer">
          <span className="p-2 border rounded shadow">Select file</span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={(e: any) => setFile(e.target?.files[0])}
          />
        </label>
      )}
      {file ? (
        <FilePicker
          trigger={<button className="flex p-2 border rounded shadow">Upload</button>}
          appId="cfaZrORgaH2PMQpIcjTpfhERIpIEUJHev09ucjTp"
          consumerId={'test-consumer-ckgrs95l3y4er0b99qa37buj2'}
          jwt={jwt}
          onSelect={(file) => console.log(file)}
          fileToSave={file}
          {...args}
        />
      ) : null}
    </div>
  )
}

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const FileSaver = Template.bind({})
FileSaver.args = {}
