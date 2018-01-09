const User = require('api/user/model')
const { safeLowerCase } = require('utils/object')

const searchUser = ({ query }) => {
  let user = query
  user = safeLowerCase(user)
  if (user === '') {
    return User.find().select(['username', 'firstname', 'surname'])
      .then(users => {
        if (users.length > 0) {
          return Promise.resolve(users)
        } else {
          return Promise.reject({message: 'Not NotFound'})
        }
      })
  }
  return User.find({
    $or: [
      { firstname: { $regex: new RegExp('^' + user, 'i') } },
      { surname: { $regex: new RegExp('^' + user, 'i') } }
    ]
  }).select(['username', 'firstname', 'surname'])
    .then(users => {
      if (users.length > 0) {
        return Promise.resolve(users)
      } else {
        return Promise.reject({ message: 'NotFound' })
      }
    })
}

module.exports = {
  searchUser
}
