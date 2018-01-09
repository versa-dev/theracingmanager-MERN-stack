const User = require('api/user/model')
const {safeTrim} = require('utils/object')
const {RESETPASSWORD} = require('data/messages')
const jwt = require('jsonwebtoken')

const resetPassword = (body, {user}) => {
  let {token, newPassword} = body
  if (!body.token) return Promise.reject()
  if (!newPassword) {
    return Promise.reject({
      message: RESETPASSWORD.ERROR
    })
  }

  let userInfo = jwt.verify(token, process.env.RESETPASSWORD_SECRET)
  if (!userInfo) return Promise.reject()
  return User.findOne({_id: userInfo.user})
    .then(_user => {
      if (!_user) {
        return Promise.reject({message: RESETPASSWORD.ERROR})
      } else {
        _user.password = safeTrim(newPassword)
        return _user.save().then(_data => Promise.resolve({
          message: RESETPASSWORD.SUCCESS
        }))
      }
    })
}

module.exports = {
  resetPassword
}
