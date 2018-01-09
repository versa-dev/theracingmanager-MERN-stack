const User = require('api/user/model')
const {CONTACTDETAILS} = require('data/messages')
const jwt = require('jsonwebtoken')

const verifyUser = body => {
  const token = body.token
  if (!token) {
    return Promise.reject()
  }

  const userInfo = jwt.verify(token, process.env.CONTACT_SECRET)
  if (!userInfo) {
    return Promise.reject()
  }

  return User.findOneAndUpdate({
    _id: userInfo.user
  }, {
    $set: {
      email: userInfo.email,
      phoneNumber: userInfo.phoneNumber
    }
  }, {
    upsert: true,
    new: true,
    strict: false,
    safe: true
  }).then(user => {
    if (user) {
      return Promise.resolve({message: CONTACTDETAILS.SUCCESS})
    } else {
      return Promise.reject()
    }
  })
}

module.exports = {
  verifyUser
}
