const apn = require('apn')

module.exports = (deviceToken, message) => {
  const options = {
    token: {
      key: process.env.APN_TOKEN_KEY,
      keyId: process.env.APN_TOKEN_KEY_ID,
      teamId: process.env.APN_TOKEN_KEY_TEAM_ID
    },
    production: false
  }
  const apnProvider = new apn.Provider(options)
  const note = new apn.Notification()
  note.expiry = Math.floor(Date.now() / 100) + 3600
  note.badge = 3
  note.alert = message

  return apnProvider.send(note, deviceToken)
}
