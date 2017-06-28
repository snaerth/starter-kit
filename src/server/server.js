/* eslint no-console: 0 */
// Enables proper source map support in Node.js
import 'source-map-support/register';

// Librarys
import http from 'http';
import path from 'path';
import morgan from 'morgan';
import express from 'express';
import RateLimit from 'express-rate-limit';
import httpProxy from 'http-proxy';

// Others
import Proxy from './proxy';
import middleware from './middleware';
import config from '../config';
import renderHtml from './utils/renderHtml';
import errorHandlers from './middleware/errorHandlers';
import handleRender from './middleware/handleRender';

const {
  ADMIN_HOST,
  ADMIN_PORT,
  ADMIN_PROTOCOL,
  PROTOCOL,
  HOST,
  PORT,
  NODE_ENV,
} = config;
const isDeveloping = NODE_ENV !== 'production';
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

// Serve static content for the app from the public directory and build directory
app.use(express.static('build'));
app.use(express.static('public'));

// Apply middleware to app
app.use(middleware());

// Handle all requests
app.get('*', handleRender);

// Error Handler middlewares.
app.use(...errorHandlers);

// Start server
server.listen(port, (error) => {
  if (error) {
    console.error(error);
  }
  console.info(
    '==> ✅  %s is running, talking to ADMIN server on %s.',
    ADMIN_HOST,
    ADMIN_PORT,
  );
  console.info(
    `==> 💻  Open ${PROTOCOL}://%s:%s in a browser to view the app.`,
    HOST,
    PORT,
  );
});
