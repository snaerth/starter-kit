'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

//  PLUGINS
const plugins = [
  new ExtractTextPlugin("styles.css"),
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
  })
];

// RULES
const jsx = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  query: {
    presets: ['react', 'es2015', 'stage-0', 'react-hmre']
  }
};

const json = {
  test: /\.json?$/,
  loader: 'json-loader'
};

const css = {
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    loader: [
      {
        loader: 'css-loader',
        query: {
          modules: true,
          sourceMap: false,
          localIdentName: '[hash:base64:5]'
        }
      },
      'postcss-loader'
    ]
  })
};

const scss = {
  test: /\.scss$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    loader: [
      {
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
  })
};

const js = {
  test: /\.js$/,
  exclude: /node_modules/,
  enforce: 'pre',
  use: [
    {
      loader: 'eslint-loader',
      options: {
        rules: {
          semi: 0
        }
      }
    }
  ]
};

const rules = [js, jsx, css, scss, json];

// --------------------------------------------- MAIN WEBPACK CONFIG
module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true', path.join(__dirname, '../src/client/index.jsx')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: plugins,
  module: {
    rules: rules
  }
};