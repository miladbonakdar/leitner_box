const emailValidator = require("./utils/emailValidator");
const passport = require('passport')
const passportJWT = require('passport-jwt')
const User = require('./models/user.model')
const LocalStrategy = require('passport-local').Strategy
const jwt_secret = require('./app.config').get().jwt_secret
const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy

module.exports = () => {
    const localStrategyMiddleware = async function (username, password, done) {
        let user
        try {
            username = username.toLowerCase()
            user = emailValidator(username) ?
                await User.findOne({email: username}) :
                await User.findOne({username})
            if (!user) {
                return done(null, false, {message: 'User cannot be found'})
            }
        } catch (e) {
            return done(e)
        }

        let match = await user.comparePassword(password)
        if (!match) {
            return done(null, false, {message: 'password is not correct'})
        }
        return done(null, {
            name: user.name,
            username: user.username,
            id: user.id,
            isAdmin: user.isAdmin
        })
    }

    passport.use(
        new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password'
            },
            localStrategyMiddleware)
    )

    const JWTStrategyMiddleware = async function (jwtPayload, done) {
        try {
            const user = await User.findById(jwtPayload.id).select('-password')
            if (!user) {
                return done(null, false, {message: 'cannot fine the user'})
            }
            delete user.password
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }

    passport.use(
        new JWTStrategy({
                jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
                secretOrKey: jwt_secret
            },
            JWTStrategyMiddleware)
    )
}
