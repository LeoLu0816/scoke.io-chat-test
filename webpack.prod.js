let webpack = require('webpack')
let merge = require('webpack-merge')
let common = require('./webpack.common.js')

module.exports = merge(common, {
  module: {
    noParse: [
      /\/vue\/dist\/vue\.min\.js$/,
      /\/vuex\/dist\/vuex\.min\.js$/,
      /\.min\.js$/
    ],
    rules: [
      {
        test: /\.(png|jpg|gif|svg|mp3|woff|eot|ttf)$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.min.js',
      'vuex$': 'vuex/dist/vuex.min.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  }
})
