var path = require('path')
let webpack = require('webpack')
let merge = require('webpack-merge')
let CleanWebpackPlugin = require('clean-webpack-plugin')

let distPath = path.resolve(__dirname, './dist')
let publicPath = process.env.PUBLIC_PATH || '/dist/'

let cacheLoader = {
  loader: 'cache-loader',
  options: {
    cacheDirectory: require('os').tmpdir()
  }
}

let config = {
  entry: {
    JBChatPlugin: ['./src/main.js']
  },
  output: {
    path: distPath,
    publicPath,
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  plugins: [
    new CleanWebpackPlugin([distPath]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'DEBUG': process.env.DEBUG === 'true'
    })
  ],
  resolve: {
    alias: {
      'lib': path.resolve(__dirname, 'src/lib'),
      'components': path.resolve(__dirname, 'src/components')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          cacheLoader,
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                sass: ['style-loader', 'css-loader', 'postcss-loader?sourceMap', 'resolve-url-loader', 'sass-loader?indentedSyntax&sourceMap'].join('!'),
                js: 'babel-loader?presets=babel-preset-env'
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: [cacheLoader, 'babel-loader?presets=babel-preset-env'],
        exclude: /(\.min\.js$)/
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.(swf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  }
}

// 是否開啟除錯模式, 有的話程式要包含 sourceMap
if (process.env.DEBUG === 'true') {
  config = merge(config, { devtool: '#eval-source-map' })
}

module.exports = config
