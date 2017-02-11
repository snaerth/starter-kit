'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const autoprefixer = require('autoprefixer');

// --------------------------------------------- PLUGINS
const plugins = [
  new webpack
    .optimize
    .OccurrenceOrderPlugin(),
  new HtmlWebpackPlugin({template: 'src/client/index.tpl.html', inject: 'body', filename: 'index.html'}),
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
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [autoprefixer]
    }
  }),
  new ExtractTextPlugin('[name]-[hash].min.css')
];

// --------------------------------------------- RULES
const rules = [
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
      fallbackLoader: "style-loader",
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
  }, {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract({
      fallbackLoader: 'style-loader',
      loader: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader'
    })
  }, {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    query: {
      presets: ['react', 'es2015', 'stage-0']
    }
  }, {
    test: /\.json?$/,
    loader: 'json-loader'
  }
];

// --------------------------------------------- MAIN WEBPACK CONFIG
module.exports = {
  entry: [path.join(__dirname, '../src/client/index.jsx')],
  output: {
    path: path.join(__dirname, './../build/public'),
    filename: '[name]-[hash].min.js',
    publicPath: '/'
  },
  plugins: plugins,
  module: {
    rules: rules
  }
};