'use strict'

const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const webpack = require('webpack')

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    hot: true,
    watchOptions: {
      poll: true
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})
