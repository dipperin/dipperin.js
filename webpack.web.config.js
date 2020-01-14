const baseConfig = require('./webpack.config')
const path = require('path')

const webConfig = {
  ...baseConfig,
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'build/main'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: {
      root: 'Dipperin',
      amd: 'Dipperin',
      commonjs: 'Dipperin'
    },
    umdNamedDefine: true
  }
}

module.exports = webConfig
