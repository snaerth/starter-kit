const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.base');
const externals = require('webpack-node-externals');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const { ADMIN_ENTRY, ADMIN_OUTPUT } = config;

const plugins = [
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      PORT: JSON.stringify(process.env.ADMIN_PORT),
      HOST: JSON.stringify(process.env.ADMIN_HOST),
      DB_URL: JSON.stringify(process.env.DB_URL),
      DB_USERNAME: JSON.stringify(process.env.DB_USERNAME),
      DB_PASSWORD: JSON.stringify(process.env.DB_PASSWORD),
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
const json = {
  test: /\.json?$/,
  use: 'json-loader',
};

const js = {
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /(node_modules)/,
  query: {
    presets: ['es2015', 'stage-0'],
  },
};

const rules = [js, json];

module.exports = {
  target: 'node',
  devtool: 'source-map',
  entry: path.join(process.cwd(), 'src/admin/server.js'),
  output: {
    path: path.join(process.cwd(), 'build'),
    filename: 'admin.js',
    sourceMapFilename: 'admin.map',
    libraryTarget: 'commonjs2',
  },
  node: {
    __filename: true,
    __dirname: true,
  },
  externals: externals({
    whitelist: [
      /\.(eot|woff|woff2|ttf|otf)$/,
      /\.(svg|png|jpg|jpeg|gif|ico|webm)$/,
      /\.(mp4|mp3|ogg|swf|webp)$/,
      /\.(css|scss|sass|less|styl)$/,
    ],
  }),
  plugins,
  module: {
    rules,
  },
};
