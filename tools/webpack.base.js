const path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const autoprefixerConfig = autoprefixer({
  browsers: [
    '>1%',
    'last 4 versions',
    'Firefox ESR',
    'not ie < 9', // React doesn't support IE8 anyway
  ],
});

const vendor = [
  'react',
  'react-dom',
  'react-helmet',
  'redux',
  'react-redux',
  'redux-thunk',
  'react-transition-group',
  'react-modal',
  'gsap',
  'axios',
  'classnames',
  'lodash',
  'isomorphic-fetch',
  'core-decorators',
];

// RULES
const urlLoader = {
  test: /\.(png|gif|jpe?g|svg)$/,
  include: path.join(process.cwd(), 'assets/images'),
  use: 'url-loader?limit=20480&name=./assets/images/[name]-[hash].[ext]',
};

const json = {
  test: /\.json?$/,
  use: 'json-loader',
};

const file = {
  test: /\.(woff2?|jpe?g|png|gif|ico)$/,
  use: 'file-loader?name=./assets/images/[name].[ext]',
};

const svg = {
  test: /\.svg$/,
  use: ['react-svgdom-loader', 'svgo-loader'],
};

// Development
const devCss = {
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      query: {
        modules: true,
        sourceMap: false,
        localIdentName: '[hash:base64:5]',
      },
    },
    'postcss-loader',
  ],
};

const devScss = {
  test: /\.scss$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      query: {
        modules: true,
        sourceMap: false,
        localIdentName: '[hash:base64:5]',
      },
    },
    'postcss-loader',
    'sass-loader',
  ],
};

const devJs = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  loaders: [
    {
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
        presets: [
          [
            'es2015',
            {
              modules: false,
            },
          ],
          'react',
          'stage-0',
          'react-hmre',
        ],
        plugins: ['transform-decorators-legacy'],
      },
    },
  ],
};

// Production
const css = {
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    loader: [
      {
        loader: 'css-loader',
        query: {
          modules: true,
          importLoaders: 2,
          localIdentName: '[name]__[local]__[hash:base64:5]',
          plugins: () => [autoprefixerConfig],
        },
      },
      {
        loader: 'postcss-loader',
      },
    ],
  }),
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
          plugins: () => [autoprefixerConfig],
        },
      },
      'postcss-loader',
      'sass-loader',
    ],
  }),
};

const js = {
  test: /\.(js|jsx)?$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  query: {
    presets: ['es2015', 'stage-0', 'react', 'react-optimize'],
  },
};

module.exports = {
  CLIENT_ENTRY: path.join(process.cwd(), 'src/client/index.js'),
  CLIENT_OUTPUT: path.join(process.cwd(), 'build/public'),
  SERVER_ENTRY: path.join(process.cwd(), 'src/server/server.js'),
  SERVER_OUTPUT: path.join(process.cwd(), 'build'),
  PUBLIC_PATH: '/assets/',
  VENDOR: vendor,
  RULES_COMMON: {
    json,
    svg,
    file,
    urlLoader,
  },
  RULES_DEV: {
    js: devJs,
    scss: devScss,
    css: devCss,
  },
  RULES_PROD: {
    js,
    css,
    scss,
  },
};
