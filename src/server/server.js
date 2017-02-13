/* eslint no-console: 0 */
// Enables proper source map support in Node.js
import 'source-map-support/register'

// DEVELOPMENT IMPORTS
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

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

import renderHtml from './utils/renderHtml';
import React from 'react';
import {Router, match, RouterContext} from 'react-router';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';

import routes, {NotFound} from '../client/routes.jsx';
import configureStore from '../client/store/configureStore';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

// Intialize and setup server
const app = express();
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
    // log all request in the Apache combined format to STDOUT
    morgan('combined')
]));

// Basic IP rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints such as password reset.
const apiLimiter = new RateLimit({
  windowMs: 10*1000, // 10 seconds
  max: 30, // limit each IP to 10 requests per windowMs 
  delayMs: 0 // disabled 
});

app.use('/api/', apiLimiter);

// Server routes
serverRoutes(app);

// DEVELOPMENT
if (isDeveloping) {
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
    app.use(express.static(__dirname + '/public'));
}

// Handle all requests
app.use('*', handleRender);

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
            return res
                .status(500)
                .send(err.message);
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
        // Send the rendered page to the client
        res.send(renderHtml(html, finalState));
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
