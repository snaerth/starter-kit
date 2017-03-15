const path = require('path');

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
  loader: 'json-loader'
};

const file = {
  test: /\.(woff2?|jpe?g|png|gif|ico)$/,
  loader: 'file-loader',
};

const svg = {
  test: /\.svg$/,
  loaders: ['react-svgdom-loader', 'svgo-loader'],
};

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
  loaders: [{
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
  }]
};

module.exports = {
  CLIENT_ENTRY: path.join(process.cwd(), 'src/client/index.jsx'),
  CLIENT_OUTPUT: path.join(process.cwd(), 'build/public'),
  SERVER_ENTRY: path.join(process.cwd(), 'src/server/server.js'),
  SERVER_OUTPUT: path.join(process.cwd(), 'build'),
  API_ENTRY: path.join(process.cwd(), 'src/api/index.js'),
  API_OUTPUT: path.join(process.cwd(), 'build'),
  PUBLIC_PATH: '/public/',
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
  }
};