const User = require('api/user/model')
const {GENERIC} = require('data/messages')

const getNotifyOptions = (body, {user}) => {
  return User.findOne({_id: user._id}, 'notifyOptions').then(data => {
    return Promise.resolve(data.notifyOptions)
  }).catch(() => Promise.reject({message: GENERIC.NOT_FOUND}))
}

const updateNotifyOptions = (body, {user}) => {
  let {email, text, apple} = body
  if (typeof email !== 'boolean' || typeof text !== 'boolean' || typeof apple !== 'boolean') {
    return Promise.reject({message: GENERIC.NOT_FOUND})
  }
  return User.findOneAndUpdate(
    {_id: user._id},
    {
      $set: {notifyOptions: body}
    }
  ).then(data => {
    return Promise.resolve()
  }).catch(() => Promise.reject({message: GENERIC.NOT_FOUND}))
}

module.exports = {
  getNotifyOptions,
  updateNotifyOptions
}
