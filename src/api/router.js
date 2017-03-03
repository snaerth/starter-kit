import passport from 'passport';
import {signin, signup, forgotPassword, isAdmin} from './controllers/authentication';
import {getNews, deleteNews, createNews, updateNews} from './controllers/news';
import {jwtLogin, localLogin} from './services/passport';

// Tell passport to use strategy
passport.use(jwtLogin);
passport.use(localLogin);

// Initialize require authentication helpers
const requireAuth = passport.authenticate('jwt');
const requireSignin = passport.authenticate('local');

/**
 * Default API routes
 * @param {Object} app - Express app referece
 * @returns {undefined}
 */
export default function (app) {
  // Authentication
  app.post('/signup', signup);
  app.post('/signin', requireSignin, signin);
  app.post('/forgot', forgotPassword);

  // News
  app.get('/api/news', [requireAuth, isAdmin], getNews);
  app.put('/api/news', [requireAuth, isAdmin], updateNews);
  app.delete('/api/news', [requireAuth, isAdmin], deleteNews);
  app.post('/api/news', [requireAuth, isAdmin], createNews);
}