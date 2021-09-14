import '@apideck/file-picker/dist/styles.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { FilePicker } from '@apideck/file-picker'

const App = () => {
  const onSelect = (file) => {
    console.log(file)
  }

  return (
    <div>
      <FilePicker
        onSelect={onSelect}
        trigger={<button>click me</button>}
        jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWRpcmVjdF91cmkiOiJodHRwczovL215c2Fhcy5jb20vZGFzaGJvYXJkIiwiY29uc3VtZXJfbWV0YWRhdGEiOnsiYWNjb3VudF9uYW1lIjoiU3BhY2VYIiwidXNlcl9uYW1lIjoiRWxvbiBNdXNrIiwiaW1hZ2UiOiJodHRwczovL3d3dy5zcGFjZXguY29tL3N0YXRpYy9pbWFnZXMvc2hhcmUuanBnIn0sInRoZW1lIjp7InZhdWx0X25hbWUiOiJJbnRlcmNvbSIsInByaW1hcnlfY29sb3IiOiIjMjg2ZWZhIiwic2lkZXBhbmVsX2JhY2tncm91bmRfY29sb3IiOiIjMjg2ZWZhIiwic2lkZXBhbmVsX3RleHRfY29sb3IiOiIjRkZGRkZGIiwiZmF2aWNvbiI6Imh0dHBzOi8vd3d3LmludGVyY29tLmNvbS9fbmV4dC9zdGF0aWMvaW1hZ2VzL2Zhdmljb24tMzQ4YWQ4ZGY2YzE2N2Q5M2ZiODk0ZThiY2I0ZGNkMmEucG5nIiwidGVybXNfdXJsIjoiaHR0cHM6Ly93d3cudGVybXNmZWVkLmNvbS90ZXJtcy1jb25kaXRpb25zLzk1N2M4NWMxYjA4OWFlOWUzMjE5YzgzZWZmNjUzNzdlIiwicHJpdmFjeV91cmwiOiJodHRwczovL2NvbXBsaWFuY2UuYXBpZGVjay5jb20vcHJpdmFjeS1wb2xpY3kifSwiY29uc3VtZXJfaWQiOiJ0ZXN0LWNvbnN1bWVyLWNrZ3JzOTVsM3k0ZXIwYjk5cWEzN2J1ajIiLCJhcHBsaWNhdGlvbl9pZCI6ImNmYVpyT1JnYUgyUE1RcEljalRwZmhFUklwSUVVSkhldjA5dWNqVHAiLCJzY29wZXMiOltdLCJpYXQiOjE2MzE2MTIzNzgsImV4cCI6MTYzMTYxNTk3OH0.qCm8ItB3OA9qELmG_UHTQWQ9E1W1jtqWZS7rmnK4zM4"
        appId={process.env.APP_ID}
        consumerId={process.env.CONSUMER_ID}
      />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
