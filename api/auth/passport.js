
// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var models       = require('../../models');
var env          = process.env.NODE_ENV || 'development';

// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    // passport local strategy for local-login, local refers to this app

    passport.use(new LocalStrategy(
        function(username, password, done) {
            models.user.findOne({
                where: {
                    'username': username
                }
            }).then(function (user) {
                if (user == null) {
                    return done(null, false, { message: 'Incorrect credentials.' })
                }

               // var hashedPassword = bcrypt.hashSync(password, user.salt)

                if (user.password === password) {
                    return done(null, user)
                }

                return done(null, false, { message: 'Incorrect credentials.' })
            })
        }
    ))

    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
        models.user.findOne({
            where: {
                'id': id
            }
        }).then(function (user) {
            if (user == null) {
                done(new Error('Wrong user id.'))
            }

            done(null, user)
        })
    })


};
