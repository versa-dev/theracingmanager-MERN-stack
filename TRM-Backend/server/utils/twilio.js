const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

module.exports = (to, message) => {
  return client.messages
    .create({
      to: to,
      from: '+441274288511',
      body: message
    })
}
