const path = require('path');
const { argv } = require('yargs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const projectRoot = process.cwd();
const { name } = require(path.resolve(projectRoot, './package'));

const isDev = argv.mode === 'development';

module.exports = {
  entry: {
    main: path.resolve(projectRoot, './src/index.tsx'),
  },
  output: {
    filename: '[name].[chunkhash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    // 微前端配置
    library: name,
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: [/node_modules/, /src[\\/]lib/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: [require.resolve('react-refresh/babel')].filter((item) => isDev && Boolean(item)),
              // 配置项目的范围，指定babel查找my-webpack-common下的babel.config.js配置
              root: path.resolve(__dirname, '../'),
            },
          },
          // 多进程
          {
            loader: 'thread-loader',
          },
        ],
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                auto: true,
                localIdentName: isDev ? '[path][name]__[local]__[hash:base64:6]' : '[hash:base64]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, '../postcss.config.js'),
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                math: 'always',
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(eot|woff|ttf|woff2|appcache|jpe?g|png|gif|ico|svg)\??.*$/,
        exclude: [/^node_modules$/, path.resolve(projectRoot, './src/svg')],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 4kb
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(projectRoot, './src/index.html'),
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.less', '.css'],
    alias: {
      '@': path.resolve(projectRoot, './src'),
      '@c': path.resolve(projectRoot, './src/components'),
      '@t': path.resolve(projectRoot, './src/types'),
      '@r': path.resolve(projectRoot, './src/routers'),
    },
    fallback: {
      dgram: false,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
    },
    // 指定依赖文件从哪里开始查找
    modules: ['node_modules', path.resolve(__dirname, '../node_modules')],
  },
  optimization: {
    // 防止app.js的缓存失效
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
      minSize: 60000,
    },
    moduleIds: 'named',
  },
  // 指定loader的依赖目录为本项目，宿主环境不需要安装loader相关依赖
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, '../node_modules')],
  },
};
