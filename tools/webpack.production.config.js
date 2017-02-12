'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const autoprefixer = require('autoprefixer');

// --------------------------------------------- PLUGINS
const plugins = [
  new webpack
    .optimize
    .OccurrenceOrderPlugin(),
  new webpack
    .optimize
    .UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
  new StatsPlugin('webpack.stats.json', {
    source: false,
    modules: false
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [autoprefixer]
    }
  }),
  new ExtractTextPlugin({filename: 'styles.css', allChunks: true})
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
  loader: ExtractTextPlugin.extract({
    fallbackLoader: "style-loader",
    loader: [
      {
        loader: 'css-loader',
        query: {
          modules: true,
          importLoaders: 2,
          localIdentName: '[name]__[local]__[hash:base64:5]',
          plugins: () => {
            return [autoprefixer]
          }
        }
      }, {
        loader: 'postcss-loader'
      }
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
          localIdentName: '[name]__[local]__[hash:base64:5]',
          plugins: () => {
            return [autoprefixer]
          }
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

// Main webpack config
module.exports = {
  entry: [path.join(__dirname, '../src/client/index.jsx')],
  target: 'node',
  output: {
    path: path.join(__dirname, './../build/public'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: plugins,
  module: {
    rules: rules
  }
};