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

### Using Tailwind?

The FilePicker is styled using [Tailwind CSS](https://tailwindcss.com/). If you were to use the File Picker component in a project that also uses Tailwind CSS, you can omit the CSS file import, and include the package in the purge path of the tailwind.config.css.

```js
// tailwind.config.js
purge: [
  './node_modules/@apideck/file-picker/dist/*.js',
],
```
