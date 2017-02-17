/* eslint-disable no-console */

/**
* Handle 404 errors.
* Note: the react application middleware hands 404 paths, but it is good to
* have this backup for paths not handled by the universal middleware. For
* example you may bind a /api path to express.
* @param {Object} req - Request object
* @param {Object} res - Response object
* @returns {undefined}
*/
function notFoundMiddlware(req, res) {
    res.status(404).send('Sorry, page not found!.');
}

/**
* Handle all unhandled errors. Typically you want to return a "500" response status.
* Note: You must provide specify all 4 parameters on this callback function
* even if they aren't used, otherwise it won't be used.
* @param {Object} err - Error object
* @param {Object} req - Request object
* @param {Object} res - Response object
* @param {Function} next - Express next function
* @returns {undefined}
*/
function unhandledErrorMiddleware(err, req, res, next) {
    res.set('content-type', 'text/html');
    res.write(500, `</head><body><h1>500 Server Error</h1><p>${err}</p></body></html>`);
    res.end();
    next(err);
}

const errorHandlersMiddleware = [notFoundMiddlware, unhandledErrorMiddleware];

export default errorHandlersMiddleware;