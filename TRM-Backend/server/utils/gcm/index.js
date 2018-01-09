const gcm = require('node-gcm')

const sendGcm = (deviceTokens, msg, payload = {}) => {
  return new Promise((resolve, reject) => {
    var message = new gcm.Message()

    message.addData(payload)
    message.addNotification('body', msg)
    message.addNotification('sound', 'default')

    var sender = new gcm.Sender(process.env.GCM_API_KEY)
    sender.send(message, deviceTokens, function (err, response) {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        console.log(response)
        resolve(response)
      }
    })
  })
}

module.exports = {
  sendGcm
}
