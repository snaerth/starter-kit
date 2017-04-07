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
  successRedirect: '/auth/facebook/callback',
  failureRedirect: '/'
});

/**
 * Default Admin routes
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
  app.get('/auth/facebook', facebookAuth);
  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', facebookAuthCallback,     
    // On success
    (req,res) => {
        // return the token or you would wish otherwise give eg. a succes message
        res.render('json', {data: JSON.stringify(req.user.access_token)});
    },

    // on error; likely to be something FacebookTokenError token invalid or already used token,
    // these errors occur when the user logs in twice with the same token
    (err,req,res) => {
        // You could put your own behavior in here, fx: you could force auth again...
        // res.redirect('/auth/facebook/');
        if(err) {
            res.status(400);
            res.render('error', {message: err.message});
        }
    });

  // Upload images
  app.post('/userimage', requireAuth, uploadUserImage);
  app.put('/user', requireAuth, updateUser);

  // News
  app.get('/news', [
    requireAuth, isAdmin
  ], getNews);
  app.put('/news', [
    requireAuth, isAdmin
  ], updateNews);
  app.delete('/news', [
    requireAuth, isAdmin
  ], deleteNews);
  app.post('/news', [
    requireAuth, isAdmin
  ], createNews);
}