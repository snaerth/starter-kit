import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import {parallel} from '../../server/utils/parallel';

const bodyParserOptions = {
    extended: false,
    parameterLimit: 100000,
    limit: 1024 * 1024 * 50
};

// Default middlewares
const defaultMiddlewares = [
    // Let app use compression
    compression(),
    // use application/json parser
    bodyParser.json(bodyParserOptions),
    // Use application/x-www-form-urlencoded parser
    bodyParser.urlencoded(bodyParserOptions),
    // Initialize passport
    passport.initialize(),
    passport.session(),
    // Prevent HTTP Parameter pollution. @note: Make sure body parser goes above the
    // hpp middleware
    hpp(),
    // Content Security Policy
    helmet(),
    // Dynamically or statically enable CORS
    cors()
];

export default(otherMiddleware) => {
    if (otherMiddleware && otherMiddleware.length > 0) {
        // Run functions parallel or async for more page speed
        return parallel([
            ...defaultMiddlewares,
            ...otherMiddleware
        ]);
    }

    // Run functions parallel or async for more page speed
    return parallel(defaultMiddlewares);
};