const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const CONFIG = require('./webpack.base');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {SERVER_ENTRY, SERVER_OUTPUT, PUBLIC_PATH} = CONFIG;

function getExternals() {
  const nodeModules = fs.readdirSync(path.join(process.cwd(), 'node_modules'));
  return nodeModules.reduce(function (ext, mod) {
    ext[mod] = 'commonjs ' + mod;
    return ext;
  }, {});
}

const plugins = [
  new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': '"production"'
    }
  }),

  new webpack.BannerPlugin({banner: 'require("source-map-support").install();', raw: true, entryOnly: false})
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
    })
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