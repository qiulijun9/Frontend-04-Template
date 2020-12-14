const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')

module.exports = {
  // 入口配置
  entry: './src/main.js',
  // 出口配置
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './dist/'),
  },
  // 模块
  module: {
    rules: [
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.vue/,
        use: 'vue-loader',
      },
      {
        test: /\.(jsx|js)$/,
        use: {
          loader: 'babel-loader?cacheDirectory',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  // 插件
  plugins: [
    //生成html模板
    new HtmlWebpackPlugin({
      template: './public/index.html', //定义模板
      title: 'webpack', //定义html title
      hash: true, //缓存,
      filename: 'index.html', //打包后的文件名
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(), //每次打包前清空dist目录
    new webpack.HotModuleReplacementPlugin(), //开启热更新
  ],
  devServer: {
    port: 3005,
    open: true,
    hot: true,
    contentBase: './dist',
  },
  //模式 开发环境 development，生产环境 production
  mode: 'development',
}
