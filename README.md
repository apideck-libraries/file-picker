# Apideck File Picker

A React file picker component that works with the Apideck [File Storage API](https://developers.apideck.com/apis/file-storage/reference).

Sign up for a free account at [apideck.com](https://app.apideck.com/signup) to obtain an API key and App ID.

## Usage

Install the component

```sh
yarn add @apideck/file-picker
```

Create a [Vault session](https://developers.apideck.com/apis/vault/reference#operation/sessionsCreate) inside your application to get a JSON Web Token.

Pass the JWT together with your App ID and a consumer ID to the FilePicker component

```js
import { FilePicker } from '@apideck/file-picker'
import '@apideck/file-picker/dist/styles.css'

const MyComponent = () => {
  const handleSelect = (file) => {
    console.log(file)
  }

  return (
    <FilePicker
      onSelect={handleSelect}
      trigger={<button>Pick a file</button>}
      jwt="token-123"
      appId="your-app-id"
      consumerId="your-consumer-id"
    />
  )
}
```

You can also provide a file through the `fileToSave` prop that will force the FilePicker to go into "Upload" mode. This will allow the user to select the connector and folder that the file needs to get saved to.

### Properties

| Property           | Type    | Required | Default             | Description                                                           |
| ------------------ | ------- | -------- | ------------------- | --------------------------------------------------------------------- |
| appId              | string  | true     | -                   | The ID of your Unify application                                      |
| consumerId         | string  | true     | -                   | The ID of the consumer which you want to fetch files from             |
| jwt                | string  | true     | -                   | The JSON Web Token returned from the Create Session call              |
| onSelect           | event   | false    | -                   | The function that gets called when a file is selected                 |
| onConnectionSelect | event   | false    | -                   | The function that gets called when a connection is selected           |
| trigger            | element | false    | -                   | The component that should trigger the File Picker modal on click      |
| title              | string  | false    | Apideck File Picker | Title shown in the modal                                              |
| subTitle           | string  | false    | Select a file       | Subtitle shown in the modal                                           |
| showAttribution    | boolean | false    | true                | Show "Powered by Apideck" in the backdrop of the modal backdrop       |
| open               | boolean | false    | false               | Opens the file picker if set to true                                  |
| onClose            | event   | false    | -                   | Function that gets called when the modal is closed                    |
| fileToSave         | file    | false    | -                   | Forces "Upload" mode to select the folder to upload the provided file |

### Using Tailwind?

The FilePicker is styled using [Tailwind CSS](https://tailwindcss.com/). If you were to use the File Picker component in a project that also uses Tailwind CSS, you can omit the CSS file import, and include the package in the purge path of the tailwind.config.css.

```js
// tailwind.config.js
purge: [
  './node_modules/@apideck/file-picker/dist/*.js',
],
```
