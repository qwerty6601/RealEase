const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: ['./src/index.js'],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'MyAuthLibrary',
        libraryTarget: 'umd'
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                resolve: {
                    fullySpecified: false,
                    fallback: {
                        "crypto": false
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/, 
                type: 'asset/resource'
            }
        ]
    },
    devServer: {
        static: './dist',
        hot: true,
        port: 8090,
        open: true
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: ['*.html']
        }),
        new CopyPlugin({
            patterns: [
              { from: "img", to: "img" },
            ],
        }),
    ]
};