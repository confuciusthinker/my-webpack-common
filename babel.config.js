module.exports = { 
    presets: [
        [
            "@babel/preset-env",  //ES的新语法转译
            {
                useBuiltIns: 'entry',
                corejs: 3,
            }   
        ],
        "@babel/preset-react",
        "@babel/preset-typescript",
    ],
    plugins: [
        [
            "@babel/plugin-transform-runtime",
            {
                corejs: false,
                helpers: false,
            }
        ], //处理polyfill
        "@babel/plugin-syntax-dynamic-import", //处理懒加载
        "lodash",
        [
            'import',
            {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true,
            },
            'antd'
        ], //antd组件按需加载
        [
            'import',
            {
                libraryName: 'my-router-config-common',
                libraryDirectory: 'lib/component',
            },
            'my-router-config-common',
        ],
    ]
}