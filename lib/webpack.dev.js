const merge = require('webpack-merge');
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { argv } = require('yargs');
// const proxyConfig = require('./proxyConfig');
const baseConfig = require('./webpack.base');

// 本地开发环境配置
const env = argv.env || 'default';
// const config = proxyConfig[env];

const devConfig = {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  // webpack5持久化缓存
  cache: {
    type: 'filesystem',
    buildDependencies: {
      // 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
      config: [__filename],
    },
    cacheDirectory: path.resolve(__dirname, '../webpack_cache'),
    idleTimeoutForInitialStore: 0,
    memoryCacheUnaffected: true,
    store: 'pack',
    compression: 'gzip',
    name: `${env}`,
  },
  devServer: {
    static: false,
    open: true,
    hot: true,
    liveReload: false, // 默认文件变化会引起刷新页面
    server: 'https',
    // 微前端配置
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    // 开发环境的端口配置
    // port: config.port,
    // 开发环境的host配置
    // host: config.host,
    // 开发环境的proxy配置
    // proxy: {
    //     '/api': {
    //         target: config.target,
    //         changeOrigin: true,
    //         pathRewrite: {
    //             '^/api': '',
    //         },
    //     }
    // },
    allowedHosts: 'all',
  },
  plugins: [
    // react热更新结合babel插件 react-refresh
    new ReactRefreshWebpackPlugin(),
  ],
};

module.exports = merge([baseConfig, devConfig]);
