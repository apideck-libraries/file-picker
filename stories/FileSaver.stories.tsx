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
const jwt = 'xxxxxx'

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
          appId={process.env.STORYBOOK_APP_ID}
          consumerId={process.env.STORYBOOK_CONSUMER_ID}
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
