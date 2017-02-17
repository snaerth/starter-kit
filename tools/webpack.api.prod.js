const webpack = require('webpack');
const path = require('path');
const CONFIG = require('./webpack.base');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const {
  API_ENTRY,
  API_OUTPUT
} = CONFIG;
const root = (folder = '.') => path.join(__dirname, '..', folder);

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"'
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': '"production"'
    }
  }),
  new webpack.NamedModulesPlugin(),
  new CaseSensitivePathsPlugin(),
  new webpack.BannerPlugin({
    banner: 'require("source-map-support").install();',
    raw: true,
    entryOnly: false
  })
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
    presets: ["es2015","stage-0"]
  }
};

const rules = [js,json];

module.exports = {
  target: 'node',
  devtool: 'source-map',
  entry: API_ENTRY,
  output: {
    path: API_OUTPUT,
    filename: 'api.js',
    sourceMapFilename: 'api.map',
    libraryTarget : 'commonjs2'
  },
  node: {
    __filename: true,
    __dirname: true
  },
  plugins,
  module: {
    rules
  }
}