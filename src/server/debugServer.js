/* eslint no-console: 0 */
import path from 'path';
import express from 'express';
import { serverRoutes } from './router';

// VARIABLES
const port = 3001;

// INITALIZE APP
const app = express();
// SETUP ROUTES
serverRoutes(app);

app.listen(port, '0.0.0.0', error => {
    if (error) {
        console.log(error);
    }
    console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});