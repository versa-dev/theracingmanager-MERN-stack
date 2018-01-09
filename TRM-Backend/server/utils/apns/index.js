const apn = require('apn')

const sendApn = (deviceToken, message, payload = {}) => {
  const options = {
    token: {
      key: 'apns.p8',
      keyId: process.env.APN_KEY_ID,
      teamId: process.env.APN_TEAM_ID
    },
    production: false
  }
  const apnProvider = new apn.Provider(options)
  const notification = new apn.Notification()
  notification.topic = 'com.vitaminlondon.trm'
  notification.expiry = Math.floor(Date.now() / 1000) + 3600
  notification.sound = 'ping.aiff'
  notification.alert = message
  notification.payload = payload

  return apnProvider.send(notification, deviceToken)
}

module.exports = {
  sendApn
}
