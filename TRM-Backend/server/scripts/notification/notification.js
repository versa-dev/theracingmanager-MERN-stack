const Users = require('api/user/model')
const sendSms = require('utils/twilio')
const {sendMail} = require('utils/email')
const sendNotification = require('utils/apn')

module.exports = () => {
  return Users.find({}).then(_users => {
    return Promise.all(_users.map(user => {
      console.log(user.phoneNumber)
      let message = `Hi ${user.firstname}, 20 news items have been added.`
      let promise = []
      if (user.notifyOptions.email && user.email) {
        let mailData = {
          to: user.email,
          subject: `News`,
          template: {
            name: `notification`,
            data: {
              content: message
            }
          }
        }
        promise.push(sendMail(mailData))
      }
      if (user.notifyOptions.text && user.phoneNumber) {
        promise.push(sendSms(user.phoneNumber, message))
      }
      if (user.notifyOptions.apple && user.deviceToken) {
        promise.push(sendNotification(user.deviceToken, message))
      }

      return promise
    }))
  }).then(res => {
    console.log(res)
    return Promise.resolve()
  }).catch(err => {
    console.log(err)
    return Promise.reject(err)
  })
}
