import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import {parallel} from '../utils/parallel';
import config from '../../config';

const {APIHOST, APIPORT, HOST, PORT} = config();
// CORS setup 
const corsWhitelist = [
    `http://${APIHOST}:${APIPORT}`,
    `http://${HOST}:${PORT}`
];
const corsOptions = {
    origin: (origin, callback) => {
        const originIsWhitelisted = corsWhitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};

const defaultMiddlewares = [
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
    // Dynamically or statically enable CORS
    cors(corsOptions)
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