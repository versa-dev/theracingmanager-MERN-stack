const User = require('api/user/model')
const {sendMail} = require('utils/email')
const {safeTrim} = require('utils/object')
const {getResetPasswordToken} = require('utils/authentication')
const {FORGOTTEN} = require('data/messages')

const forgottenPassword = body => {
  let email = body.email
  if (!email) {
    return Promise.reject({
      messages: FORGOTTEN.ERROR.EMPTY_PARAM
    })
  }
  email = safeTrim(email)
  let user
  return User.findOne({email})
    .then(_user => {
      user = _user
      if (!user || !user.email) {
        return Promise.reject({message: FORGOTTEN.ERROR.NOT_FOUND})
      } else {
        const token = getResetPasswordToken(user)
        let mailData = {
          to: email,
          subject: `The Racing Manager Reset Password`,
          template: {
            name: 'resetPassword',
            data: {
              firstname: _user.firstname,
              token: token
            }
          }
        }
        sendMail(mailData)
        return Promise.resolve({message: FORGOTTEN.SUCCESS})
      }
    })
}

module.exports = {
  forgottenPassword
}
