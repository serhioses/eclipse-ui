var webpack = require('webpack');

module.exports = {
    entry: './eclipse-ui.js',
    externals: {
        jquery: 'jQuery',
        eclipse: 'eclipse'
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