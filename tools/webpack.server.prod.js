const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const CONFIG = require('./webpack.base');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const externals = require('webpack-node-externals');
const cloneDeep = require('lodash/cloneDeep');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const {
  SERVER_ENTRY,
  SERVER_OUTPUT,
  PUBLIC_PATH
} = CONFIG;
const root = (folder = '.') => path.join(__dirname, '..', folder);

function getExternals() {
  const nodeModules = fs.readdirSync(path.join(process.cwd(), 'node_modules'));
  return nodeModules.reduce(function(ext, mod) {
    ext[mod] = 'commonjs ' + mod;
    return ext;
  }, {});
}

function extendLoader(loader, test, name) {
  const out = cloneDeep(loader);
  out.test = test;
  out
    .loaders
    .push(name);
  return out;
}

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
const jsx = {
  test: /\.jsx$/,
  loader: 'babel-loader',
  query: {
    presets: ["es2015", "react", "stage-0", "react-optimize"]
  },
  exclude: /(node_modules)/
};

const json = {
  test: /\.json?$/,
  use: 'json-loader'
};

const css = {
  test: /\.css$/,
  include: root('src'),
  loaders: [
    'style-loader', {
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

const scss = extendLoader(css, /\.(scss|sass)$/, 'sass-loader');

const js = {
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    presets: ["es2015", "react", "stage-0", "react-optimize"]
  },
  exclude: /(node_modules)/
};

const rules = [js, jsx, css, scss, json];

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