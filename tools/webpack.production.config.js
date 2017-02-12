'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const autoprefixer = require('autoprefixer');
const externals = require('webpack-node-externals');

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
  new webpack.DefinePlugin({'process.env.NODE_ENV': 'production'}),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [autoprefixer]
    }
  }),
  new ExtractTextPlugin({filename: 'styles.css', allChunks: true}),
  new webpack
    .optimize
    .CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js'})
];

// RULES
const jsx = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  query: {
    presets: ['react', 'es2015', 'stage-0']
  }
};

const json = {
  test: /\.json?$/,
  use: 'json-loader'
};

const css = {
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    fallback: "style-loader",
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
  test: /\.js?$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  query: {
    "presets": ["es2015", "stage-0", "react"]
  }
};

const rules = [js, jsx, css, scss, json];

const whitelist = {
  whitelist: [/\.(eot|woff|woff2|ttf|otf)$/, /\.(svg|png|jpg|jpeg|gif|ico|webm)$/, /\.(mp4|mp3|ogg|swf|webp)$/, /\.(css|scss|sass|less|styl)$/]
};

const vendor = [
  'react',
  'react-dom',
  'react-helmet',
  'react-redux',
  'lodash',
  'isomorphic-fetch',
  'core-decorators'
];

// Main webpack config
module.exports = {
  entry: {
    app: [
      'babel-register', path.join(__dirname, '../src/client/index.jsx')
    ],
    vendor
  },
  cache: true,
  target: 'node',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, './../build/server/public'),
    filename: '[name].js',
    publicPath: '/',
    libraryTarget: 'commonjs2'
  },
  plugins: plugins,
  module: {
    rules: rules
  },
  externals: externals(whitelist)
};