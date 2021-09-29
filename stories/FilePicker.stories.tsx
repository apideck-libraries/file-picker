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
const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWRpcmVjdF91cmkiOiJodHRwczovL215c2Fhcy5jb20vZGFzaGJvYXJkIiwiY29uc3VtZXJfbWV0YWRhdGEiOnsiYWNjb3VudF9uYW1lIjoiU3BhY2VYIiwidXNlcl9uYW1lIjoiRWxvbiBNdXNrIiwiaW1hZ2UiOiJodHRwczovL3d3dy5zcGFjZXguY29tL3N0YXRpYy9pbWFnZXMvc2hhcmUuanBnIn0sInRoZW1lIjp7InZhdWx0X25hbWUiOiJJbnRlcmNvbSIsInByaW1hcnlfY29sb3IiOiIjMjg2ZWZhIiwic2lkZXBhbmVsX2JhY2tncm91bmRfY29sb3IiOiIjMjg2ZWZhIiwic2lkZXBhbmVsX3RleHRfY29sb3IiOiIjRkZGRkZGIiwiZmF2aWNvbiI6Imh0dHBzOi8vd3d3LmludGVyY29tLmNvbS9fbmV4dC9zdGF0aWMvaW1hZ2VzL2Zhdmljb24tMzQ4YWQ4ZGY2YzE2N2Q5M2ZiODk0ZThiY2I0ZGNkMmEucG5nIiwidGVybXNfdXJsIjoiaHR0cHM6Ly93d3cudGVybXNmZWVkLmNvbS90ZXJtcy1jb25kaXRpb25zLzk1N2M4NWMxYjA4OWFlOWUzMjE5YzgzZWZmNjUzNzdlIiwicHJpdmFjeV91cmwiOiJodHRwczovL2NvbXBsaWFuY2UuYXBpZGVjay5jb20vcHJpdmFjeS1wb2xpY3kifSwiY29uc3VtZXJfaWQiOiJ0ZXN0LWNvbnN1bWVyIiwiYXBwbGljYXRpb25faWQiOiJjZmFack9SZ2FIMlBNUXBJY2pUcGZoRVJJcElFVUpIZXYwOXVjalRwIiwic2NvcGVzIjpbXSwiaWF0IjoxNjMyOTE1Njc0LCJleHAiOjE2MzI5MTkyNzR9.RBRviqw45ZPz_Z6-j_7cjK95TZEfUYu2FcpXarumNjw'

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
