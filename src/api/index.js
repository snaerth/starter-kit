/* eslint no-console: 0 */

// Default imports
import http from 'http';
import express from 'express';
import RateLimit from 'express-rate-limit';
import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import {parallel} from '../server/utils/parallel';
import {serverRoutes} from './router';
import errorHandlers from '../server/middleware/errorHandlers';
import config from './config';

// VARIABLES
const {APIPORT, APIHOST} = config();

// Intialize and setup server
const app = express();
// Create HTTP Server
const server = new http.createServer(app);

// Basic IP rate-limiting middleware for Express. Use to limit repeated requests
// to public APIs and/or endpoints such as password reset.
const apiLimiter = new RateLimit({
    windowMs: 10 *1000, // 10 seconds
    max: 30, // limit each IP to 10 requests per windowMs
    delayMs: 0 // disabled
});


// Hide all software information
app.disable('x-powered-by');

// Run Middlewares parallel/async for more page speed
app.use(parallel([
    // Let app use compression
    compression(),
    // use application/json parser
    bodyParser.json(),
    // Use application/x-www-form-urlencoded parser
    bodyParser.urlencoded({extended: false}),
    // Prevent HTTP Parameter pollution. @note: Make sure body parser goes above the
    // hpp middleware
    hpp(),
    // Content Security Policy
    helmet(),
    // Middleware for dynamically or statically enabling CORS in express applications
    cors(),
    // Basic IP rate-limiting middleware for Express. 
    apiLimiter
]));

// Api routes
serverRoutes(app);

// Error Handler middlewares.
app.use(...errorHandlers);

// Start server
server.listen(APIPORT, error => {
  if (error) {
    console.error(error);
  }
  console.info('==> ✅  API server is running on %s:%s.', APIHOST, APIPORT);
});
