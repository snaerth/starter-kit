import passport from 'passport';
import {
  signin,
  signup
} from './controllers/authentication';

// Initialize require authentication helpers
const requireAuth = passport.authenticate('jwt', {
  session: false
});
const requireSignin = passport.authenticate('local', {
  session: false
});

export default function(app) {
  app.post('/signup', signup);
  app.post('/signin', requireSignin, signin);
  app.post('/api', requireAuth, (req, res) => {
    res.send('This is an route with required authentication API');
  });
  app.get('/test', (req, res) => {
    res.send('test');
  });
}