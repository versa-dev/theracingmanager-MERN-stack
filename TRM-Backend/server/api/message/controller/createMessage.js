const Message = require('api/message/model')
const {HorseModel} = require('api/horse/model')
const {MESSAGE} = require('data/messages')
const {sendApn} = require('utils/apns')
const {sendMail} = require('utils/email')
const sendSms = require('utils/twilio')

const validateAttachment = (body) => {
  let validated = false
  const requiredProps = ['attachment', 'text']
  requiredProps.forEach((propName) => {
    if (body[propName] && body[propName].length > 0) {
      validated = true
    }
  })
  return validated
}

module.exports = (body, options = {}) => {
  const newMessage = new Message(body)
  const {user} = options
  const {horseId, userId} = body

  if (userId) {
    newMessage.userId = userId
  } else {
    newMessage.userId = user._id
  }

  let errors = newMessage.validateSync()
  if (!errors && validateAttachment(newMessage)) {
    return newMessage.save(
    ).then(() => {
      // notify to users
      return HorseModel.findOne({_id: horseId}).then(horse => {
        let horseName = horse.name
        let message = `Hi ${user.firstname} ${user.surname} You posted message to ${horseName}`
        let promises = []
        if (user.notifyOptions.email && user.email) {
          let mailData = {
            to: user.email,
            subject: `Post Message`,
            template: {
              name: `notification`,
              data: {
                content: message
              }
            }
          }
          promises.push(sendMail(mailData))
        }

        if (user.notifyOptions.text && user.phoneNumber) {
          promises.push(sendSms(user.phoneNumber, message))
        }

        if (user.notifyOptions.apple && user.deviceToken) {
          promises.push(sendApn(user.deviceToken, message))
        }
        return Promise.all(promises)
      }).then(_result => {
        return Promise.resolve(MESSAGE.SUCCESS)
      })
    })
  } else {
    return Promise.reject()
  }
}
