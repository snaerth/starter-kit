'use strict';

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CONFIG = require('./webpack.base');

const {CLIENT_ENTRY, CLIENT_OUTPUT, PUBLIC_PATH} = CONFIG;

//  PLUGINS
const plugins = [
  new ExtractTextPlugin({filename: 'styles.css', allChunks: true}),
  new webpack
    .optimize
    .OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [autoprefixer]
    }
  }),
  new webpack
    .optimize
    .CommonsChunkPlugin({name: 'vendor', minChunks: Infinity, filename: 'vendor.js'})
];

// RULES
const json = {
  test: /\.json?$/,
  loader: 'json-loader'
};

const css = {
  test: /\.css$/,
  use: [
    'style-loader', {
      loader: 'css-loader',
      query: {
        modules: true,
        sourceMap: false,
        localIdentName: '[hash:base64:5]'
      }
    },
    'postcss-loader'
  ]
};

const scss = {
  test: /\.scss$/,
  use: [
    'style-loader', {
      loader: 'css-loader',
      query: {
        modules: true,
        sourceMap: false,
        localIdentName: '[hash:base64:5]'
      }
    },
    'postcss-loader',
    'sass-loader'
  ]
};

const js = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  loaders: [
    {
      loader: 'babel-loader',
      query: {
        presets: [
          [
            'es2015', {
              modules: false
            }
          ],
          'react',
          'stage-0',
          'react-hmre'
        ],
        plugins: ['transform-decorators-legacy']
      }
    }
  ]
};

const rules = [js, css, scss, json];

const vendor = [
  'react',
  'react-dom',
  'react-helmet',
  'redux',
  'react-redux',
  'lodash',
  'isomorphic-fetch',
  'core-decorators'
];

// --------------------------------------------- MAIN WEBPACK CONFIG
module.exports = {
  devtool: 'source-map',
  target: 'web',
  cache: true,
  entry: {
    main: [
      'webpack/hot/only-dev-server', 'webpack-hot-middleware/client', CLIENT_ENTRY
    ],
    vendor
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js'
  },
  plugins,
  module: {
    rules
  }
};