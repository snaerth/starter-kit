const webpack = require('webpack');
const path = require('path');
const CONFIG = require('./webpack.base');
const externals = require('webpack-node-externals');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const {
  SERVER_ENTRY,
  SERVER_OUTPUT,
  RULES_COMMON,
  RULES_DEV,
  RULES_PROD,
} = CONFIG;

const plugins = [
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      PORT: JSON.stringify(process.env.PORT),
      HOST: JSON.stringify(process.env.HOST),
    },
    __CLIENT__: false,
    __SERVER__: true,
    __DEVELOPMENT__: false,
    __DEVTOOLS__: false,
  }),
  new webpack.NamedModulesPlugin(),
  new CaseSensitivePathsPlugin(),
  new webpack.BannerPlugin({
    banner: 'require("source-map-support").install();',
    raw: true,
    entryOnly: false,
  }),
];

// RULES
const { json, svg } = RULES_COMMON;
const { scss, css } = RULES_DEV;
const { js } = RULES_PROD;
const rules = [js, css, scss, json, svg];

module.exports = {
  target: 'node',
  devtool: 'source-map',
  entry: SERVER_ENTRY,
  output: {
    path: SERVER_OUTPUT,
    filename: 'server.js',
    sourceMapFilename: 'server.map',
    libraryTarget: 'commonjs2',
  },
  externals: externals({
    whitelist: [
      /\.(eot|woff|woff2|ttf|otf)$/,
      /\.(svg|png|jpg|jpeg|gif|ico|webm)$/,
      /\.(mp4|mp3|ogg|swf|webp)$/,
      /\.(css|scss|sass|less|styl)$/,
    ],
  }),
  node: {
    __filename: true,
    __dirname: true,
  },
  plugins,
  module: {
    rules,
  },
};
