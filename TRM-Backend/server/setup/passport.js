const passport = require('passport')
const {Strategy, ExtractJwt} = require('passport-jwt')

const User = require('api/user/model')

passport.use(new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: process.env.PASSPORT_SECRET
  },
  (payload, done) => {
    User.findOne({
      _id: payload.user
    }).then(user => {
      if (user && !user.verification) {
        done(null, user)
      } else {
        done(null, false)
      }
    }).catch(err => {
      done(err, false)
    })
  }
))

module.exports = () => {
  return passport.initialize()
}
