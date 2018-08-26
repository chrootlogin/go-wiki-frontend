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
    },
    // Fix CORS
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})
