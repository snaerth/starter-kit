const webpack = require('webpack');
const path = require('path');
const CONFIG = require('./webpack.base');
const externals = require('webpack-node-externals');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const {
  SERVER_ENTRY,
  SERVER_OUTPUT
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

const css = {
  test: /\.css$/,
  use: [
    {
      loader: 'css-loader',
      query: {
        sourceMap: false,
        modules: true,
        importLoaders: 1,
        localIdentName: '[name]_[local]_[hash:base64:5]'
      }
    },
    'postcss-loader'
  ]
};

const scss = {
  test: /\.(scss|sass)$/,
  use: [
    {
      loader: 'css-loader',
      query: {
        sourceMap: false,
        modules: true,
        importLoaders: 1,
        localIdentName: '[name]_[local]_[hash:base64:5]'
      }
    },
    'sass-loader',
    'postcss-loader'
  ]
};

const js = {
  test: /\.(js|jsx)$/,
  loader: 'babel-loader',
  exclude: /(node_modules)/,
  query: {
    presets: ["es2015", "react", "stage-0", "react-optimize"]
  }
};

const rules = [js, css, scss, json];

module.exports = {
  target: 'node',
  devtool: 'source-map',
  entry: SERVER_ENTRY,
  output: {
    path: SERVER_OUTPUT,
    filename: 'server.js',
    sourceMapFilename: 'server.map',
    libraryTarget : 'commonjs2'
  },
  externals: externals({
    whitelist: [/\.(eot|woff|woff2|ttf|otf)$/, /\.(svg|png|jpg|jpeg|gif|ico|webm)$/, /\.(mp4|mp3|ogg|swf|webp)$/, /\.(css|scss|sass|less|styl)$/]
  }),
  node: {
    __filename: true,
    __dirname: true
  },
  plugins,
  module: {
    rules
  }
}