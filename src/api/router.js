import passport from 'passport';
import {signin, signup} from './controllers/authentication';
import {jwtLogin, localLogin} from './services/passport';

// Tell passport to use strategy
passport.use(jwtLogin);
passport.use(localLogin);

// Initialize require authentication helpers
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

/**
 * Default API routes
 * @param {Object} app - Express app referece
 * @returns {undefined}
 */
export default function (app) {
  // API routes
  app.post('/signup', signup);
  app.post('/signin', requireSignin, signin);
  app.post('/api', requireAuth, (req, res) => {
    res.send('This is an route with required authentication API');
  });
  app.get('/test', (req, res) => {
    res.send('test');
  });
}