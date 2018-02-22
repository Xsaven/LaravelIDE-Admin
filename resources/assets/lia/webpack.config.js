const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

'use strict';

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080', // webpack dev server host and port
        path.join(__dirname, '/index.js'), // entry point of app
    ],

    output: {
        filename: "build.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        library: "lib"
    },
    plugins: [
        /*new HtmlWebpackPlugin({
            filename: '/src/index.html',
            template: './index.html'
        }),*/
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            CStore: path.resolve(__dirname, "layout/cstore.js"),
        }),
        new ExtractTextPlugin('styles.css')
    ],
    module: {

        loaders: [
            {test: /\.js$/, loader: "babel?optional[]=runtime"}
        ],
        rules: [
            { test: /\.css$/, loader: "style-loader!css-loader?importLoaders=1" },
            { test: /\.(png|woff|woff2|eot|ttf|svg|jpg)$/, loader: 'url-loader?limit=100000' },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }
        ]
    }
};