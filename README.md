# my-webpack-common
通用webpack5配置

## 使用
-  CLI使用
```bash
webpack --config ./node_modules/my-webpack-common/lib/webpack.prod.js --mode production --env distBase=dist
```

- 配置文件重新配置再使用  
webpack.dev.config.js（一般是重新配置proxy）
```js
const merge = require('webpack-merge');
const webpackDev = require('my-webpack-common/lib/webpack.dev');
const { argv } = require('yargs');

const proxyConfig = require('./proxyConfig');

// 本地开发环境配置，默认 rental 环境
const env = argv.env || 'rental';
const config = proxyConfig[env];

const devServerProxy = {
    '/api': {
        target: config.target,
        changeOrigin: true,
        pathRewrite: {
            '^/api': '',
        },
    },
};

// 这里使用属性替换方式而不是用merge，因为proxy的匹配规则跟顺序有关
webpackDev.devServer.proxy = devServerProxy;

module.exports = webpackDev;

```

pacakage.json
```json
{
    "scripts": {
        "dev": "webpack-dev-server --hot --config config/webpack.dev.config.js --mode development --env dev"
    }
}

```