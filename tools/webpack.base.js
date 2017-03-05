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

module.exports = {
  CLIENT_ENTRY:  path.join(process.cwd(), 'src/client/index.jsx'),
  CLIENT_OUTPUT: path.join(process.cwd(), 'build/public'),
  SERVER_ENTRY:  path.join(process.cwd(), 'src/server/server.js'),
  SERVER_OUTPUT: path.join(process.cwd(), 'build'),
  API_ENTRY:  path.join(process.cwd(), 'src/api/index.js'),
  API_OUTPUT: path.join(process.cwd(), 'build'),
  PUBLIC_PATH: '/public/',
  VENDOR: vendor
};