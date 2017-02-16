/* eslint no-console: 0 */
// Enables proper source map support in Node.js
import 'source-map-support/register';
// Eviromental variables
import dotenv from 'dotenv';
dotenv.config();

// DEVELOPMENT IMPORTS
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

// Default imports
import http from 'http';
import path from 'path';
import morgan from 'morgan';
import express from 'express';
import RateLimit from 'express-rate-limit';
import {serverRoutes} from './router';
import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import {parallel} from './utils/parallel';

// React server rendering
import renderHtml from './utils/renderHtml';
import React from 'react';
import {Router, match, RouterContext} from 'react-router';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import routes, {NotFound} from '../client/routes.jsx';
import configureStore from '../client/store/configureStore';

let assets = null;
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

// Intialize and setup server
const app = express();
const router = express.Router();
// Hide all software information
app.disable('x-powered-by');

// Run functions parallel or async for more page speed
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
    express.static('./src/assets/favicon')
]));

// Basic IP rate-limiting middleware for Express. Use to limit repeated requests
// to public APIs and/or endpoints such as password reset.
const apiLimiter = new RateLimit({
    windowMs: 10 *1000, // 10 seconds
    max: 30, // limit each IP to 10 requests per windowMs
    delayMs: 0 // disabled
});


// DEVELOPMENT
if (isDeveloping) {
    // log all request in the Apache combined format to STDOUT
    app.use(morgan('dev'));

    const config = require('../../tools/webpack.config.js');
    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
} else {
    // PRODUCTION
    assets = require('../../assets.json');
    app.use(express.static('./build'));
}


// Route middleware that will happen on every request
router.use(function(req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);
    // continue doing what we were doing and go to the route
    next(); 
});

router.get('/api/', apiLimiter);

// Server routes
serverRoutes(router);

// Handle all requests
router.get('*', handleRender);

// 500 error
// router.use((err, req, res, next) => {
//   res.set('content-type', 'text/html');
//   res.write(`</head><body><h1>500 Server Error</h1><p>${err}</p></body></html>`);
//   res.end();
//   next(err);
// });

app.use('*', router);

function handleRender(req, res) {
    res.set('content-type', 'text/html');
    // Do a router match
    match({
        routes: (
            <Router>{routes}</Router>
        ),
        location: req.url
    }, (err, redirect, props) => {
        // Sanity checks
        if (err) {
            return res.status(500).send(err.message);
        } else if (redirect) {
            return res.redirect(302, redirect.pathname + redirect.search);
        } else if (props.components.some(component => component === NotFound)) {
            res.status(404);
        }

        // Compile an initial state
        const preloadedState = {
            counter: 10
        };
        // Create a new Redux store instance
        const store = configureStore(preloadedState);
        // Render the component to a string
        const html = renderToString(
            <Provider store={store}>
                <RouterContext {...props}/>
            </Provider>
        );
        // Grab the initial state from Redux store
        const finalState = store.getState();

        const renderHtmlObj = {
            html,
            finalState,
            assets
        };

        res.status(200);
        // Send the rendered page to the client
        res.send(renderHtml(renderHtmlObj));
        res.end();
    });
}

// Create HTTP Server
const server = http.createServer(app);

// Start
server.listen(port, err => {
    if (err) {
        throw err;
    }
    console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
