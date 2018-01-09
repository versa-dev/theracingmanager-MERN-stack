// This is temporary for managing users before we have actual admin ui

const UserController = require('api/user/controller')
const HorseController = require('api/horse/controller')
const {AUTHENTICATION} = require('data/messages')
const {METHODS} = require('data/messages')

const getUser = (body) => {
  return UserController.findOne(
    body
  ).then(user => {
    if (user) return Promise.resolve(user)
    else {
      return Promise.reject({
        message: METHODS.USER.NOT_FOUND(body.email)
      })
    }
  })
}

const updateUser = (body) => {
  const {email, horse, user, password} = body
  if (!user || !password) {
    return Promise.reject({
      message: `Provide credentials as 'user' and 'password'.`
    })
  }

  if (!(email && email.length > 0)) {
    return Promise.reject({message: 'Please provide at least one email(comma separated)'})
  }

  if (!(horse && horse.length > 0)) {
    return Promise.reject({message: 'Please provide at least one horse(comma separated)'})
  }

  let emails = email.split(',')
  let horses = horse.split(',')

  let users

  return getUser({
    email: user
  }).catch(() => {
    return Promise.reject({message: AUTHENTICATION.ERROR})
  }).then(user => {
    return user.validatePassword(password)
  }).then(() => {
    return Promise.all(
      emails.map(e => (
        getUser({email: e.trim()}))
      ))
  }).then(_users => {
    users = _users
    return Promise.all(
      horses.map(h => (HorseController.findOne({name: h.toUpperCase()})))
    )
  }).then(horses => {
    let promises = []
    users.forEach(user => {
      horses.forEach(horse => {
        user.addShare({horse})
      })
      promises.push(user.save())
    })
    return Promise.all(promises)
  }).then(() => Promise.resolve())
}

module.exports = {
  updateUser
}
