var webpack = require('webpack');

module.exports = {
    entry: './eclipse-ui.js',
    externals: {
        eclipse: {
            commonjs: 'eclipse',
            commonjs2: 'eclipse',
            amd: 'eclipse',
            umd: 'eclipse',
            root: 'eclipse'
        },
        jquery: {
            commonjs: 'jquery',
            commonjs2: 'jquery',
            amd: 'jquery',
            umd: 'jquery',
            root: 'jQuery'
        }
    },
    output: {
        path: __dirname,
        filename: 'eclipse-ui.js',
        libraryTarget: 'umd',
        umdNamedDefine: false
    },
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                },
                test: /\.js$/,
                exclude: /(node_modules)/
            }
        ]
    },
    devtool: null
};