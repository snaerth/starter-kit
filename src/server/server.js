/* eslint no-console: 0 */

// DEVELOPMENT IMPORTS
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import http from 'http';
import path from 'path';
import express from 'express';
import { serverRoutes } from './router';
import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import renderHtml from './utils/renderHtml';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

// Intialize and setup server
const app = express();
app.use('/public', express.static(__dirname + '/public'));
// Let app use compression
app.use(compression());
// Hide all software information
app.disable('x-powered-by');
// use application/json parser
app.use(bodyParser.json());
// Use application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
// Prevent HTTP Parameter pollution.
// @note: Make sure body parser goes above the hpp middleware
app.use(hpp());
// Content Security Policy
app.use(helmet());

// Server routes
serverRoutes(app);

// DEVELOPMENT
if (isDeveloping) {
    const rootPath = isDeveloping
        ? '../../'
        : './';
    const webpackDevConfig = `${rootPath}tools/webpack.config.js`;
    const config = require(webpackDevConfig);
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
    app.get('*', (req, res) => {
        res.set('content-type', 'text/html');
        res.write(renderHtml());
        //res.write(middleware.fileSystem.readFileSync(config.output.path + 'index.html'));
        res.end();
    });
} else {
    // PRODUCTION
    app.use(express.static(__dirname + '/public'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });
}

// Create HTTP Server
const server = http.createServer(app);

// Start
server.listen(port, err => {
  if (err) throw err;
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
