import { FilePicker, Props } from '../src/components/FilePicker'
import { Meta, Story } from '@storybook/react'

import React from 'react'

const meta: Meta = {
  title: 'FilePicker',
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

const Template: Story<Props> = (args) => (
  <FilePicker
    trigger={<button className="p-2 border rounded shadow">Pick a file</button>}
    appId={process.env.STORYBOOK_APP_ID}
    consumerId={process.env.STORYBOOK_CONSUMER_ID}
    jwt={jwt}
    onSelect={(file) => console.log(file)}
    {...args}
  />
)

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Button = Template.bind({})
Button.args = {}

export const Input = Template.bind({})
Input.args = {
  trigger: (
    <input id="file" placeholder="Input trigger" name="file" className="p-2 border rounded" />
  )
}

export const Programaticly = Template.bind({})
Programaticly.args = {
  trigger: undefined,
  open: true,
  onClose: () => console.log('closed')
}
