let merge = require('webpack-merge')
let common = require('./webpack.common.js')

module.exports = merge(common, {
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.js',
      'vuex$': 'vuex/dist/vuex.js'
    }
  },
  module: {
    noParse: [
      /\/vue\/dist\/vue\.js$/,
      /\/vuex\/dist\/vuex\.js$/,
      /\.min\.js$/
    ],
    rules: [
      {
        test: /\.(png|jpg|gif|svg|mp3|woff|eot|ttf)$/,
        loader: 'file-loader',
        options: {
          name: '[name]_[hash].[ext]'
        }
      }
    ]
  },
  performance: {
    hints: false
  },
  watchOptions: !process.env.DOCKER_VM ? {} : {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  }
})
