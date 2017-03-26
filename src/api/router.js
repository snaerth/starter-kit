import passport from 'passport';
import {
  signin,
  signup,
  forgotPassword,
  resetPassword,
  isAdmin,
  uploadUserImage,
  updateUser
} from './controllers/authentication';
import { getNews, deleteNews, createNews, updateNews } from './controllers/news';
import { jwtLogin, localLogin, facebookLogin } from './services/passport';

// Tell passport to use strategys
passport.use(jwtLogin);
passport.use(localLogin);
passport.use(facebookLogin);

// Initialize require authentication helpers
const requireAuth = passport.authenticate('jwt');
const requireSignin = passport.authenticate('local');
const facebookAuth = passport.authenticate('facebook', { scope: 'email' });
const facebookAuthCallback = passport.authenticate('facebook', {
  successRedirect: '/profile',
  failureRedirect: '/'
});

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
  app.post('/reset/:token', resetPassword);
  // Facebook authentication
  app.get('/facebook', facebookAuth);
  // handle the callback after facebook has authenticated the user
  app.get('/facebook/callback', facebookAuthCallback, (req, res) => {
    // Successful authentication, redirect home.
    console.log('Facebook authenticated');
    res.redirect('/');
  });

  // Upload images
  app.post('/userimage', requireAuth, uploadUserImage);
  app.put('/user', requireAuth, updateUser);

  // News
  app.get('/api/news', [
    requireAuth, isAdmin
  ], getNews);
  app.put('/api/news', [
    requireAuth, isAdmin
  ], updateNews);
  app.delete('/api/news', [
    requireAuth, isAdmin
  ], deleteNews);
  app.post('/api/news', [
    requireAuth, isAdmin
  ], createNews);
}