import passport from 'passport';
import User from '../models/user';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import LocalStrategy from 'passport-local';
import {removeUserProps, tokenForUser} from '../controllers/authentication';
import config from '../../config';

// VARIABLES
const { JWT_SECRET, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, FACEBOOK_CALLBACK_URL, APIHOST, APIPORT } = config();

// Setup options for local strategy
const localOptions = {
    usernameField: 'email',
    passwordField: 'password'
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

            if (!isMatch) {
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

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
const facebookOptions = {
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: `http://${APIHOST}:${APIPORT}/facebook/callback`
    //profileFields: ['id', 'displayName', 'photos', 'email', 'birthday', 'cover']
};

export const facebookLogin = new FacebookStrategy(facebookOptions, (accessToken, refreshToken, profile, done) => {
    process.nextTick(function () {
        // Find the user in the database based on their facebook id
        User.findOne({ 'facebook.id': profile.id }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (user) {
                return done(null, user);
            } else {
                // if there is no user found with that facebook id, create them
                const newUser = new User();

                // set all of the facebook information in our user model
                newUser.facebook.id = profile.id;
                newUser.facebook.token = accessToken;
                newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.facebook.email = profile.emails[0].value;

                // save our user to the database
                newUser.save(function (err) {
                    if (err)
                        throw err;
                    // if successful, return the new user
                    return done(null, newUser);
                });
                // Save user to databases
                // newUser.save((error) => {
                //     if (error) {
                //         return done(err);
                //     }

                //     let newUser = removeUserProps(user);

                //     return ({
                //         token: tokenForUser(newUser),
                //         ...newUser
                //     });
                // });
            }

        });
    });

    return done(null, profile);
});

// Only the user ID is serialized to the session, keeping the amount of data
// stored within the session small
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// When subsequent requests are received, this ID is used to find the user,
// which will be restored to req.user
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
