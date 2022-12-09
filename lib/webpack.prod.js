const merge = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { argv } = require('yargs');
const baseConfig = require('./webpack.base');

const projectRoot = process.cwd();
const isProd = process.env.NODE_ENV === 'production'; // 是否是生产

// 打包的目标地址，从webpack命令参数动态获取
let distBase = 'dist';
if (argv.env && argv.env.includes('distBase')) {
  distBase = argv.env.split('=')[1] || 'dist';
}

const prodConfig = {
  mode: 'production',
  devtool: 'hidden-source-map',
  output: {
    path: path.resolve(projectRoot, `./${distBase}/`),
    publicPath: `/${distBase}/`,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    moduleIds: 'deterministic',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // 生产去除console.log和debugger
            pure_funcs: isProd ? ['console.log', 'debugger'] : null,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
};

module.exports = merge([baseConfig, prodConfig]);
