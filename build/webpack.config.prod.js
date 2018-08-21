'use strict'

const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(baseConfig, {
  mode: 'production',
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({})
    ]
  }
})
