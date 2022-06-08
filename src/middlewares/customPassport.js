const passport = require('passport')


const passportJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            const err = {}
            err.message = 'Unauthorized'
    
            return res.status(401).json(err) // send the error response to client
        }
        req.user = user
        return next() // continue to next middleware if no error.
    })(req, res, next) /* passport.authentication returns a function,
                            we invoke it with normal req..res arguments 
                            to override default functionality */ 
}

const passportLocal = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            const err = {}
            err.message = 'Unauthorized'

            console.log("error")
    
            return res.status(401).json(err) // send the error response to client
        }
        req.user = user
        return next() // continue to next middleware if no error.
    })(req, res, next) /* passport.authentication returns a function,
                            we invoke it with normal req..res arguments 
                            to override default functionality */ 
}

const notRequirePassportJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (user) {
            req.user = user
        }
        return next() // continue to next middleware if no error.
    })(req, res, next) /* passport.authentication returns a function,
                            we invoke it with normal req..res arguments 
                            to override default functionality */ 
}

const passportJWTAdmin = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user || user.role !== 'admin') {
            const err = {}
            err.message = 'Unauthorized'
    
            return res.status(401).json(err) // send the error response to client
        }
        req.user = user
        return next() // continue to next middleware if no error.
    })(req, res, next) /* passport.authentication returns a function,
                            we invoke it with normal req..res arguments 
                            to override default functionality */ 
}

const passportLocalAdmin = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user || user.role !== 'admin') {
            const err = {}
            err.message = 'Unauthorized'

            console.log("error")
    
            return res.status(401).json(err) // send the error response to client
        }
        req.user = user
        return next() // continue to next middleware if no error.
    })(req, res, next) /* passport.authentication returns a function,
                            we invoke it with normal req..res arguments 
                            to override default functionality */ 
}

module.exports = {
    passportJWT,
    passportLocal,
    notRequirePassportJWT,
    passportJWTAdmin,
    passportLocalAdmin
}