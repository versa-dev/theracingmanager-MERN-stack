const sendSms = require('utils/twilio')

module.exports = () => {
  let message = 'Hi, Welcome to TRM'
  let phoneNumber = '+447791902408'
  return sendSms(phoneNumber, message).then(_res => {
    return Promise.resolve()
  }).catch(_err => {
    console.log(_err)
    return Promise.reject(_err)
  })
}
