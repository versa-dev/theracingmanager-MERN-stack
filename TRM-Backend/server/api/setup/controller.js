const {prepareUserData} = require('utils/authentication')

const getSetup = (body, {user}) => {
  return Promise.resolve({
    user: prepareUserData(user)
  })
}

module.exports = {
  getSetup
}
