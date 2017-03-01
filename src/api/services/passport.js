import passport from 'passport';
import User from '../models/user';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import LocalStrategy from 'passport-local';
import config from '../../config';

// VARIABLES
const {JWT_SECRET} = config();

// Setup options for local strategy
const localOptions = {
    usernameField: 'email',
    passwordField: 'password',
};

// Create local strategy
export const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    // Verify username and passport, call done with that user if correct credentials
    // otherwise call done with false
    User.findOne({
        email
    }, (error, user) => {
        if (error) {
            return done(error);
        }

        if (!user) {
            return done(null, false);
        }
        
        // Compare password to encrypted password
        user.comparePassword(password, (error, isMatch) => {
            if (error) {
                return done(error);
            }

            if (!isMatch)  {
                return done(null, false);
            }

            return done(null, user);
        });
    });
});

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
};

// Create JWT Strategy
export const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    // Check if user ID in the payload exist in database
    User.findById(payload.sub, (error, user) => {
        if (error) 
            return done(error, false);
        
        // If user exists call done with that user
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

// Only the user ID is serialized to the session, 
// keeping the amount of data stored within the session small
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// When subsequent requests are received, 
// this ID is used to find the user, 
// which will be restored to req.user
passport.deserializeUser((id, done) =>{
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
