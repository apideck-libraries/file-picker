const config = require('./tailwind-config')

module.exports = config({
  darkMode: 'class',
  purge: ['./src/index.tsx'],
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
})
