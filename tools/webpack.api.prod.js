const webpack = require('webpack');
const path = require('path');
const CONFIG = require('./webpack.base');
const externals = require('webpack-node-externals');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const {API_ENTRY, API_OUTPUT} = CONFIG;

const plugins = [
    new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'PORT': JSON.stringify(process.env.APIPORT),
      'HOST': JSON.stringify(process.env.APIHOST),
      'DB_URL': JSON.stringify(process.env.DB_URL),
      'DB_USERNAME': JSON.stringify(process.env.DB_USERNAME),
      'DB_PASSWORD': JSON.stringify(process.env.DB_PASSWORD)
    }
  }),
  new webpack.NamedModulesPlugin(),
  new CaseSensitivePathsPlugin(),
  new webpack.BannerPlugin({banner: 'require("source-map-support").install();', raw: true, entryOnly: false})
];

// RULES
const json = {
  test: /\.json?$/,
  use: 'json-loader'
};

const js = {
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /(node_modules)/,
  query: {
    presets: ["es2015", "stage-0"]
  }
};

const rules = [js, json];

module.exports = {
  target: 'node',
  devtool: 'source-map',
  entry: API_ENTRY,
  output: {
    path: API_OUTPUT,
    filename: 'api.js',
    sourceMapFilename: 'api.map',
    libraryTarget: 'commonjs2'
  },
  node: {
    __filename: true,
    __dirname: true
  },
  externals: externals(),
  plugins,
  module: {
    rules
  }
}