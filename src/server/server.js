/* eslint no-console: 0 */
// Enables proper source map support in Node.js
import 'source-map-support/register';

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
import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import httpProxy from 'http-proxy';
import {parallel} from './utils/parallel';
import errorHandlers from './middleware/errorHandlers';
import config from './config';

// React server rendering
import renderHtml from './utils/renderHtml';
import React from 'react';
import {Router, match, RouterContext} from 'react-router';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import routes, {NotFound} from '../client/routes.jsx';
import configureStore from '../client/store/configureStore';

let assets = null;
const {APIHOST, APIPORT, HOST, PORT, NODE_ENV} = config();
const isDeveloping = NODE_ENV !== 'production';
const port = PORT || 3000;
const targetUrl = `${ APIHOST }:${APIPORT}`;

// Intialize and setup server
const app = express();
// Create HTTP Server
const server = new http.createServer(app);

const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, {target: targetUrl});
});

// Added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json;

  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});

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

// DEVELOPMENT
if (isDeveloping) {
    // log all request in the Apache combined format to STDOUT
    app.use(morgan('dev'));

    const config = require('../../tools/webpack.client.dev.js');
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

    const renderHtmlObj = {
        html: null,
        finalState: null,
        assets: null
    };

    app.get('*', function response(req, res) {
        res
            .set('content-type', 'text/html')
            .status(200)
            .send(renderHtml(renderHtmlObj))
            .end();
    });
} else {
    // PRODUCTION
    assets = require('../../assets.json');
    app.use(express.static('./build'));
    // Handle all requests
    app.get('*', handleRender);
}

// Error Handler middlewares.
app.use((err, req, res, next) => {
    res.set('content-type', 'text/html');
    res.status(500),
    res.send(`</head><body><h1>500 Server Error</h1><p>${err}</p></body></html>`);
    res.end();
    next(err);
});

/**
 * Handles all request and renders react universally
 * @param {Object} req - Request object
 * @param {Object} res - Reponse object
 * @returns {undefined}
 */
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
            return res.send(500, err.message);
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

// Start server 
server.listen(port, error => {
    if (error) {
        console.error(error);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', APIHOST, APIPORT);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', HOST, PORT);
});
