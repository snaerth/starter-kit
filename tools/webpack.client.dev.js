'use strict';

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CONFIG = require('./webpack.base');
const {
  CLIENT_ENTRY,
  CLIENT_OUTPUT,
  PUBLIC_PATH,
  VENDOR,
  RULES_DEV,
  RULES_COMMON
} = CONFIG;

//  PLUGINS
const plugins = [
  new webpack.optimize.ModuleConcatenationPlugin(),
  new ExtractTextPlugin({ filename: 'styles.css', allChunks: true }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: true // <-------- DISABLE redux-devtools HERE
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [autoprefixer]
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: 6,
    filename: 'vendor.js'
  })
];

// RULES
const { file, json, svg, urlLoader } = RULES_COMMON;
const { scss, js, css } = RULES_DEV;
const rules = [js, css, scss, json, file, svg];

// --------------------------------------------- MAIN WEBPACK CONFIG
module.exports = {
  devtool: 'source-map',
  target: 'web',
  cache: true,
  entry: {
    main: [
      'webpack/hot/only-dev-server',
      'webpack-hot-middleware/client',
      CLIENT_ENTRY
    ],
    vendor: VENDOR
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    publicPath: '/'
  },
  devServer: {
    compress: true,
    historyApiFallback: true,
    hot: true,
    https: false,
    noInfo: true
  },
  plugins,
  module: {
    rules
  }
};
