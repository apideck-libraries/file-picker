import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { FilePicker } from '../.'

const App = () => {
  return (
    <div>
      <FilePicker
        onSelect={(file) => console.log(file)}
        trigger={<button>click me</button>}
        jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWRpcmVjdF91cmkiOiJodHRwczovL215c2Fhcy5jb20vZGFzaGJvYXJkIiwiY29uc3VtZXJfbWV0YWRhdGEiOnsiYWNjb3VudF9uYW1lIjoiU3BhY2VYIiwidXNlcl9uYW1lIjoiRWxvbiBNdXNrIiwiaW1hZ2UiOiJodHRwczovL3d3dy5zcGFjZXguY29tL3N0YXRpYy9pbWFnZXMvc2hhcmUuanBnIn0sInRoZW1lIjp7InZhdWx0X25hbWUiOiJJbnRlcmNvbSIsInByaW1hcnlfY29sb3IiOiIjMjg2ZWZhIiwic2lkZXBhbmVsX2JhY2tncm91bmRfY29sb3IiOiIjMjg2ZWZhIiwic2lkZXBhbmVsX3RleHRfY29sb3IiOiIjRkZGRkZGIiwiZmF2aWNvbiI6Imh0dHBzOi8vd3d3LmludGVyY29tLmNvbS9fbmV4dC9zdGF0aWMvaW1hZ2VzL2Zhdmljb24tMzQ4YWQ4ZGY2YzE2N2Q5M2ZiODk0ZThiY2I0ZGNkMmEucG5nIiwidGVybXNfdXJsIjoiaHR0cHM6Ly93d3cudGVybXNmZWVkLmNvbS90ZXJtcy1jb25kaXRpb25zLzk1N2M4NWMxYjA4OWFlOWUzMjE5YzgzZWZmNjUzNzdlIiwicHJpdmFjeV91cmwiOiJodHRwczovL2NvbXBsaWFuY2UuYXBpZGVjay5jb20vcHJpdmFjeS1wb2xpY3kifSwiY29uc3VtZXJfaWQiOiJ0ZXN0LWNvbnN1bWVyLWNrZ3JzOTVsM3k0ZXIwYjk5cWEzN2J1ajIiLCJhcHBsaWNhdGlvbl9pZCI6ImNmYVpyT1JnYUgyUE1RcEljalRwZmhFUklwSUVVSkhldjA5dWNqVHAiLCJzY29wZXMiOltdLCJpYXQiOjE2MzE1NDUzNDYsImV4cCI6MTYzMTU0ODk0Nn0.9EvW0ucnYpHFq0FWn2RX46ul8Iv8qo4d5s9O-Jss59A"
        appId={process.env.APP_ID}
        consumerId={process.env.CONSUMER_ID}
      />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
