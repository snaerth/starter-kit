const path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const vendor = [
  'react',
  'react-dom',
  'react-helmet',
  'redux',
  'react-redux',
  'redux-thunk',
  'react-addons-css-transition-group',
  'gsap',
  'axios',
  'classnames',
  'lodash',
  'isomorphic-fetch',
  'core-decorators'
];

// RULES
const json = {
  test: /\.json?$/,
  use: ['json-loader']
};

const file = {
  test: /\.(woff2?|jpe?g|png|gif|ico)$/,
  use: ['file-loader']
};

const svg = {
  test: /\.svg$/,
  use: ['react-svgdom-loader', 'svgo-loader']
};

// Development
const devCss = {
  test: /\.css$/,
  use: [
    'style-loader', {
      loader: 'css-loader',
      query: {
        modules: true,
        sourceMap: false,
        localIdentName: '[hash:base64:5]'
      }
    },
    'postcss-loader'
  ]
};

const devScss = {
  test: /\.scss$/,
  use: [
    'style-loader', {
      loader: 'css-loader',
      query: {
        modules: true,
        sourceMap: false,
        localIdentName: '[hash:base64:5]'
      }
    },
    'postcss-loader',
    'sass-loader'
  ]
};

const devJs = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  loaders: [
    {
      loader: 'babel-loader',
      query: {
        presets: [
          [
            'es2015', {
              modules: false
            }
          ],
          'react',
          'stage-0',
          'react-hmre'
        ],
        plugins: ['transform-decorators-legacy']
      }
    }
  ]
};

// Production
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
  test: /\.(js|jsx)?$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  query: {
    "presets": ["es2015", "stage-0", "react", "react-optimize"]
  }
};

module.exports = {
  CLIENT_ENTRY: path.join(process.cwd(), 'src/client/index.jsx'),
  CLIENT_OUTPUT: path.join(process.cwd(), 'build/public'),
  SERVER_ENTRY: path.join(process.cwd(), 'src/server/server.js'),
  SERVER_OUTPUT: path.join(process.cwd(), 'build'),
  API_ENTRY: path.join(process.cwd(), 'src/api/index.js'),
  API_OUTPUT: path.join(process.cwd(), 'build'),
  PUBLIC_PATH: '/assets/',
  VENDOR: vendor,
  RULES_COMMON: {
    json: json,
    svg: svg,
    file: file
  },
  RULES_DEV: {
    js: devJs,
    scss: devScss,
    css: devCss
  },
  RULES_PROD: {
    js,
    css,
    scss
  }
};