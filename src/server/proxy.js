/* eslint no-console: 0 */
import httpProxy from 'http-proxy';

export function Proxy({ app, target }) {
  const proxy = httpProxy.createProxyServer({ target });

  // Proxy to Admin server
  app.use('/admin', (req, res) => {
    proxy.web(req, res, { target });
  });

  // Added the error handling to avoid
  // https://github.com/nodejitsu/node-http-proxy/issues/527
  proxy.on('error', (error, req, res) => {
    let json;

    if (error.code !== 'ECONNRESET') {
      console.error('proxy error', error);
    }

    if (!res.headersSent) {
      res.writeHead(500, { 'content-type': 'application/json' });
    }

    json = {
      error: 'proxy_error',
      reason: error.message
    };
    res.end(JSON.stringify(json));
  });

  return proxy;
}
