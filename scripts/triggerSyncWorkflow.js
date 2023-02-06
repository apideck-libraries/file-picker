const fetch = require('node-fetch-commonjs')
const dotenv = require('dotenv')
dotenv.config()

const triggerSyncWorkflow = function () {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${process.env.GH_PERSONAL_TOKEN}`
    },
    body: JSON.stringify({ ref: 'main' })
  }
  fetch(
    `https://api.github.com/repos/apideck-io/iframe-file-picker/actions/workflows/update-file-picker.yml/dispatches`,
    options
  ).catch((err) => console.log(err))
}

triggerSyncWorkflow()
