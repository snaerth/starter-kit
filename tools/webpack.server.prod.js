const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const StatsPlugin = require('stats-webpack-plugin');

const CONFIG = require('./webpack.base');
const {
  SERVER_ENTRY,
  SERVER_OUTPUT,
  PUBLIC_PATH
} = CONFIG;

function getExternals() {
  const nodeModules = fs.readdirSync(path.join(process.cwd(), 'node_modules'));
  return nodeModules.reduce(function(ext, mod) {
    ext[mod] = 'commonjs ' + mod;
    return ext;
  }, {});
}

const plugins = [
  new StatsPlugin('webpack.stats.json', {
    source: false,
    modules: false
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"'
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': '"production"'
    }
  }),

  new webpack.BannerPlugin({
    banner: 'require("source-map-support").install();',
    raw: true,
    entryOnly: false
  }),
  new webpack.IgnorePlugin(/\.(css|less|scss|svg|png|jpe?g|png)$/)
];

// RULES
const jsx = {
  test: /\.jsx$/,
  loader: 'babel-loader',
  query: {
    presets: ["es2015", "react", "stage-0", "react-optimize"],
  },
  exclude: /(node_modules)/
};

const json = {
  test: /\.json?$/,
  use: 'json-loader'
};

const js = {
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    presets: ["es2015", "react", "stage-0", "react-optimize"],
  },
  exclude: /(node_modules)/
};

const rules = [js, jsx, json];



module.exports = {
  target: 'node',
  devtool: 'inline-source-map',
  entry: SERVER_ENTRY,
  output: {
    path: SERVER_OUTPUT,
    filename: 'server.js'
  },
  externals: getExternals(),
  node: {
    __filename: true,
    __dirname: true
  },
  plugins,
  module: {
    rules
  }
}