const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const externals = require('webpack-node-externals');
const AssetsPlugin = require('assets-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CONFIG = require('./webpack.base');
const {CLIENT_ENTRY, CLIENT_OUTPUT, PUBLIC_PATH, VENDOR} = CONFIG;

// Plugins
const plugins = [
  new webpack
    .optimize
    .OccurrenceOrderPlugin(),
  new webpack
    .optimize
    .AggressiveMergingPlugin(),
  new ExtractTextPlugin({filename: 'styles.css', allChunks: true}),
  new webpack
    .optimize
    .CommonsChunkPlugin({name: 'vendor', filename: 'vendor_[hash].js', minChunks: 2}),
  new AssetsPlugin({filename: 'assets.json', prettyPrint: true}),
  new webpack.NamedModulesPlugin(),
  new CaseSensitivePathsPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack
    .optimize
    .UglifyJsPlugin(),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    options: {
      postcss: [autoprefixer]
    }
  })
];

// Rules
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
  }),  
  include: /flexboxgrid/

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
  test: /\.(js|jsx)?$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  query: {
    "presets": ["es2015", "stage-0", "react", "react-optimize"]
  }
};

const rules = [js, css, scss, json];

// Main webpack config
module.exports = {
  entry: {
    main: [CLIENT_ENTRY],
    vendor: VENDOR
  },
  target: 'web',
  devtool: false,
  output: {
    filename: '[name]_[chunkhash].js',
    chunkFilename: '[name]_[chunkhash].js',
    sourceMapFilename: '[name]_[chunkhash].map',
    publicPath: '/',
    path: 'build'
  },
  plugins,
  module: {
    rules
  }
};