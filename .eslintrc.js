module.exports = {
    "parser": "@babel/eslint-parser",
    "extends": "airbnb-base",
    "env": {
        "browser": true,
        "node": true
    },
    "rules": {
        "import/no-dynamic-require": "warn",
    }
};