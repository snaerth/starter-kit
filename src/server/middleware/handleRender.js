// React server rendering
import renderHtml from '../utils/renderHtml';
import React from 'react';
import { Router, match, RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import routes, { NotFound } from '../../client/routes';
import configureStore from '../../client/store/configureStore';

let assets = require('../../../assets.json');

/**
 * Handles all request and renders react universally
 * @param {Object} req - Request object
 * @param {Object} res - Reponse object
 * @returns {undefined}
 */
export default function handleRender(req, res) {
  res.set('content-type', 'text/html');
  // Do a router match
  match(
    {
      routes: <Router>{routes}</Router>,
      location: req.url
    },
    (err, redirect, props) => {
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
          <RouterContext {...props} />
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
    }
  );
}
