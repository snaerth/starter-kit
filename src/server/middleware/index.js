import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import { parallel } from '../utils/parallel';

const defaultMiddlewares = [
  // Let app use compression
  compression(),
  // use application/json parser
  bodyParser.json(),
  // Use application/x-www-form-urlencoded parser
  bodyParser.urlencoded({ extended: false }),
  // Prevent HTTP Parameter pollution. @note: Make sure body parser goes above the
  // hpp middleware
  hpp(),
  // Content Security Policy
  helmet(),
  // Dynamically or statically enable CORS
  cors()
];

export default otherMiddleware => {
  if (otherMiddleware && otherMiddleware.length > 0) {
    // Run functions parallel or async for more page speed
    return parallel([...defaultMiddlewares, ...otherMiddleware]);
  }

  // Run functions parallel or async for more page speed
  return parallel(defaultMiddlewares);
};
