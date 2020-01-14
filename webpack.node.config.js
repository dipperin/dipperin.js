const baseConfig = require('./webpack.config')
const path = require('path')

const nodeConfig = {
  ...baseConfig,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build/main'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  }
}

module.exports = nodeConfig
