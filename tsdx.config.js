const postcss = require('rollup-plugin-postcss')
const peerDepsExternal = require('rollup-plugin-peer-deps-external')
const pkg = require('./package.json')
const { nodeResolve } = require('@rollup/plugin-node-resolve')

const extensions = ['.js', '.jsx', '.ts', '.tsx']
const externals = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  './src'
]

module.exports = {
  rollup(config, options) {
    if (config.output.format === 'umd') {
      delete config.external
    }
    config.external = externals
    config.plugins.push(
      peerDepsExternal(),
      nodeResolve({
        ignoreGlobal: false,
        include: ['node_modules/**'],
        extensions
        // skip: keys(externals) // <<-- skip: ['react', 'react-dom']
      }),
      postcss({
        config: {
          path: './postcss.config.js'
        },
        extensions: ['.css'],
        minimize: true,
        inject: {
          insertAt: 'top'
        },
        sourceMap: false
      })
    )
    return config
  }
}
