const User = require('api/user/model')
const {CHANGEPASSWORD} = require('data/messages')
const {safeTrim} = require('utils/object')

const changePwd = (body, {user}) => {
  let {oldPassword, newPassword} = body
  if (!oldPassword || !newPassword) {
    return Promise.reject({
      message: CHANGEPASSWORD.ERROR.EMPTY_PARAM
    })
  }
  let userInfo
  return User.findOne({_id: user._id})
    .then(_user => {
      userInfo = _user
      if (!userInfo) {
        return Promise.reject({message: CHANGEPASSWORD.ERROR.NOT_FOUND})
      }
      return userInfo.validatePassword(oldPassword)
    })
    .then(() => {
      userInfo.password = safeTrim(newPassword)
      return userInfo.save().then(_data => Promise.resolve({message: CHANGEPASSWORD.SUCCESS}))
    })
}

module.exports = {
  changePwd
}
