const FacebookStrategy = require("passport-facebook").Strategy;
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_CLIENTID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: "https://ch4t4pp.herokuapp.com/api/auth/facebook/callback",
            profileFields: ['id', 'name', 'picture.type(large)', 'emails', 'displayName', 'about', 'gender']
        },
        (token, refreshToken, profile, cb) => {
            User.findOne({
                email: profile.emails[0].value
            }, async (err, mailUser) => {
                if (err) {
                    cb(err);
                }
                if (mailUser) {
                    if (mailUser.password) {
                        mailUser.password = null;
                        await mailUser.save();
                    }
                    cb(null, mailUser);
                } else {
                    console.log('Them user');

                    const newUser = new User({
                        name: profile.name.familyName + ' ' + profile.name.givenName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                        isVerified: true
                    })

                    newUser.save((err) => {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, newUser);
                        }
                    })
                }
            })

        }))
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    });
}