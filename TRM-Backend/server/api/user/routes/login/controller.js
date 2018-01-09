const User = require('api/user/model')
const {AUTHENTICATION} = require('data/messages')
const {generateToken} = require('utils/authentication')
const {safeLowerCase} = require('utils/object')

const loginUser = (body) => {
  let {email, password} = body
  if (!email || !password) {
    return Promise.reject({
      message: 'Provide email and password.'
    })
  }
  email = safeLowerCase(email)
  let user
  return User.findOne({email})
    .then(_user => {
      user = _user
      if (!user || !user.email) {
        return Promise.reject({message: AUTHENTICATION.ERROR})
      } else {
        return user.validatePassword(password).then(() => {
          return user.active === true ? Promise.resolve() : Promise.reject({message: AUTHENTICATION.DEACTIVE})
        })
      }
    })
    .then(() => generateToken(user))
}

module.exports = {
  loginUser
}
