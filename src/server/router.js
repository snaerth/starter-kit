import passport from 'passport';
import { signin, signup } from './controllers/authentication';

// Initialize require authentication helpers
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

export function serverRoutes(router) {
  router.post('/signup', signup);
  router.post('/signin', requireSignin, signin);
  router.post('/api', requireAuth, (req, res) => {
    res.send('This is an route with required authentication API');
  });
}


