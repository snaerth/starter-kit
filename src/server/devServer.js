/* eslint no-console: 0 */
// Enables proper source map support in Node.js
import 'source-map-support/register';

// Development
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../tools/webpack.client.dev';

// Librarys
import http from 'http';
import path from 'path';
import morgan from 'morgan';
import express from 'express';
import RateLimit from 'express-rate-limit';
import httpProxy from 'http-proxy';

// Others
import { Proxy } from './proxy';
import middleware from './middleware';
import config from '../config';
import renderHtml from './utils/renderHtml';
import errorHandlers from './middleware/errorHandlers';

const {
  ADMIN_HOST,
  ADMIN_PORT,
  ADMIN_PROTOCOL,
  PROTOCOL,
  HOST,
  PORT,
  NODE_ENV
} = config();
const port = PORT || 3000;
const target = `${ADMIN_PROTOCOL}://${ADMIN_HOST}:${ADMIN_PORT}`;

// Initialize and setup server
const app = express();

// Create HTTP Server
const server = new http.createServer(app);

// Initialize proxy server
Proxy({ app, target });

// Hide all software information
app.disable('x-powered-by');

// Apply middleware to app
app.use(middleware());

// Serve static content for the app from the assets/favicon directory and build directory
app.use(express.static('assets/favicon'));
app.use(express.static('assets'));

// Log all request in the Apache combined format to STDOUT
app.use(morgan('dev'));

// Webpack dev server
const compiler = webpack(webpackConfig);
app.use(
  webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'src',
    quiet: true,
    noInfo: true,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  })
);
app.use(webpackHotMiddleware(compiler));

const renderHtmlObj = {
  html: null,
  finalState: null,
  assets: null
};

app.get('*', function response(req, res) {
  res
    .set('content-type', 'text/html')
    .status(200)
    .send(renderHtml(renderHtmlObj))
    .end();
});

// Error Handler middlewares.
app.use(...errorHandlers);

// Start server
server.listen(port, error => {
  if (error) {
    console.error(error);
  }
  
  console.info(
    '==> ✅  %s is running, talking to ADMIN server on %s.',
    ADMIN_HOST,
    ADMIN_PORT
  );
  console.info(
    `==> 💻  Open ${PROTOCOL}://%s:%s in a browser to view the app.`,
    HOST,
    PORT
  );
});
