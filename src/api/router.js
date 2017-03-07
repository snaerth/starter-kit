import passport from 'passport';
import {signin, signup, forgotPassword, resetPassword, isAdmin} from './controllers/authentication';
import {getNews, deleteNews, createNews, updateNews} from './controllers/news';
import {jwtLogin, localLogin} from './services/passport';
import * as multer from 'multer';

const upload = multer({ dest: '../../assets/' });

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
  app.post('/signup', upload.single('image'), signup);
  app.post('/signin', requireSignin, signin);
  app.post('/forgot', forgotPassword);
  app.post('/reset/:token', resetPassword);

  // News
  app.get('/api/news', [requireAuth, isAdmin], getNews);
  app.put('/api/news', [requireAuth, isAdmin], updateNews);
  app.delete('/api/news', [requireAuth, isAdmin], deleteNews);
  app.post('/api/news', [requireAuth, isAdmin], createNews);
}