// The script to perform status updates on contego checks

const {updateWaiting} = require('api/user/routes/contego/controller')

module.exports = () => {
  return updateWaiting()
}
