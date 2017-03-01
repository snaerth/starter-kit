/* eslint no-console: 0 */
import http from 'http';
import express from 'express';
import RateLimit from 'express-rate-limit';
import session from 'express-session';
import routes from './router';
import errorHandlers from '../server/middleware/errorHandlers';
import middleware from './middleware';
import config from '../config';
import db from './db';

// VARIABLES
const {
  APIPORT,
  APIHOST,
  DB_URL,
  SESSION_SECRET
} = config();

// Intialize and setup server
const app = express();

// Create HTTP Server
const server = new http.createServer(app);

// Basic IP rate-limiting middleware for Express. Use to limit repeated requests
// to public APIs and/or endpoints such as password reset.
const apiLimiter = new RateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 30, // limit each IP to 10 requests per windowMs
  delayMs: 0 // disabled
});

// Express session options
const sessionOptions = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 86400
  } //24 Hours
}

// Production
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

db(DB_URL, () => {
  // Hide all software information
  app.disable('x-powered-by');

  // Apply middleware to app
  app.use(middleware([apiLimiter, session(sessionOptions)]));

  // Api routes
  routes(app);

  // Error Handler middlewares.
  app.use(...errorHandlers);
});

// Start API
server.listen(APIPORT, error => {
  if (error) {
    console.error(error);
  }
  console.info('==> ✅  API server is running on %s:%s.', APIHOST, APIPORT);
});