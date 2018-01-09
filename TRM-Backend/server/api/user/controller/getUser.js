const {prepareUserData} = require('utils/authentication')

module.exports = (body, {user}) => {
  return Promise.resolve(prepareUserData(user))
}
