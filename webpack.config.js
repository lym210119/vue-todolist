const path = require('path')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web',  // 编译目标web平台
  // 入口文件
  entry: path.join(__dirname, 'src/index.js'),
  // 输入
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },

      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader', // url-loader 的作用可以把图片转化为base64位代码
            options: {
              limit: 1024,    // 文件大小小于1024
              name: '[name]-aaa.[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 配置全局常量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    // 生成html 文件
    new HTMLWebpackPlugin({
      title: '这里是HTMLWebpackPlugin生成的吗？'
    }),
    new ExtractTextPlugin('styles.css')
  ]

}

if (isDev) {
  config.module.rules.push(
    {
      test: /\.styl$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        },
        'stylus-loader'
      ]
    },
  )
  config.devtool = '#cheap-module-eval-source-map'
  config.devServer = {
    port: 9527,
    host: '0.0.0.0',
    // If you want to show warnings as well as errors:
    overlay: {
      warnings: true,
      errors: true 
    },
    // 开启模块热替换
    hot: true,
    // 自动打开浏览器
    // open: true
  }
  config.plugins.push(
    // 模块热替换插件
    new webpack.HotModuleReplacementPlugin(),
    //
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  config.output.filename = '[name].[chunkhash:8].js'
  config.module.rules.push(
    {
      test: /\.styl$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader', 
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      })
    },
  )
  config.plugins.push(
    new ExtractTextPlugin('styles.[contentHash:8].css')
  )
}

module.exports = config