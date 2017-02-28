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


function isAdmin(req, res, next) {

    // do any checks you want to in here
    var test = typeof req.user.roles;
    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.user.roles.indexOf('admin') > -1)
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/');
}

  // Admin routes
  app.get('/admin', [requireAuth, isAdmin], (req, res) => {
      res.send('admin route');
  });
}