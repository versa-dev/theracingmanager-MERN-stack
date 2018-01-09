const User = require('api/user/model')
const {GENERIC} = require('data/messages')

const deactivateUser = (body, {user}) => {
  let userInfo
  return User.findOne({_id: user._id})
    .then(_user => {
      userInfo = _user
      if (!userInfo) {
        return Promise.reject({message: GENERIC.NOT_FOUND})
      } else {
        userInfo.active = false
        return userInfo.save().then(_data => Promise.resolve({message: 'deactivated'}))
      }
    })
}
module.exports = {
  deactivateUser
}
