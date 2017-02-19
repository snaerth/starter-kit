/* eslint no-console: 0 */
// Enables proper source map support in Node.js
import 'source-map-support/register';

// Development
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../tools/webpack.client.dev';

// Librarys
import http from 'http';
import path from 'path';
import morgan from 'morgan';
import express from 'express';
import RateLimit from 'express-rate-limit';
import httpProxy from 'http-proxy';

// Others
import middleware from './middleware';
import config from '../config';
import renderHtml from './utils/renderHtml';
import errorHandlers from './middleware/errorHandlers';

const {APIHOST, APIPORT, HOST, PORT} = config();
const port = PORT || 3000;
const targetUrl = `http://${APIHOST}:${APIPORT}`;

// Intialize and setup server
const app = express();

// Create HTTP Server
const server = new http.createServer(app);
const proxy = httpProxy.createProxyServer({target: targetUrl});

// Hide all software information
app.disable('x-powered-by');

// Apply middleware to app
app.use(middleware());

app.use(express.static('./src/assets/favicon'));
// Log all request in the Apache combined format to STDOUT
app.use(morgan('dev'));

// Proxy to API server
app.use('/api', (req, res) => {
    proxy.web(req, res, {target: targetUrl});
});

// Added the error handling to avoid
// https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
    let json;

    if (error.code !== 'ECONNRESET') {
        console.error('proxy error', error);
    }

    if (!res.headersSent) {
        res.writeHead(500, {'content-type': 'application/json'});
    }

    json = {
        error: 'proxy_error',
        reason: error.message
    };
    res.end(JSON.stringify(json));
});

const compiler = webpack(webpackConfig);
app.use(webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'src',
    stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
    }
}));
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

// Error Handler middlewares.
app.use(...errorHandlers);

// Start server
server.listen(port, error => {
    if (error) {
        console.error(error);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', APIHOST, APIPORT);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', HOST, PORT);
});
