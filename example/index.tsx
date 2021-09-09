import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { FilePicker } from '../.'

const App = () => {
  return (
    <div>
      <FilePicker jwt="1234" />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
