import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import {parallel} from '../utils/parallel';

export default() => {
    // Run functions parallel or async for more page speed
    return parallel([
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
        helmet()
    ]);
};