const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const externals = require('webpack-node-externals');
const AssetsPlugin = require('assets-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CONFIG = require('./webpack.base');
const {
  CLIENT_ENTRY,
  CLIENT_OUTPUT,
  PUBLIC_PATH,
  VENDOR,
  RULES_PROD,
  RULES_COMMON
} = CONFIG;

// Plugins
const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.AggressiveMergingPlugin(),
  new ExtractTextPlugin({ filename: 'styles.css', allChunks: true }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor_[hash].js',
    minChunks: 2
  }),
  new AssetsPlugin({ filename: 'assets.json', prettyPrint: true }),
  new webpack.NamedModulesPlugin(),
  new CaseSensitivePathsPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      PORT: JSON.stringify(process.env.PORT),
      HOST: JSON.stringify(process.env.HOST)
    },
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: false,
    __DEVTOOLS__: false
  }),
  new webpack.optimize.UglifyJsPlugin(),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    options: {
      postcss: [autoprefixer]
    }
  })
];

// RULES
const { file, json, svg, urlLoader } = RULES_COMMON;
const { scss, js, css } = RULES_PROD;
const rules = [js, css, scss, json, file, svg];

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
    path: '/build'
  },
  plugins,
  module: {
    rules
  }
};
