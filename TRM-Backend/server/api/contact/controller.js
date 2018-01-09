const {sendMail} = require('utils/email')
const {safeTrim} = require('utils/object')
const {validateEmail} = require('utils/validation')

const contactMessage = body => {
  let {name, email, subject, message} = body
  console.log(message)

  const supportEmail = 'info@theracingmanager.com'
  if (name === undefined ||
      email === undefined ||
      subject === undefined ||
      message === undefined) {
    return Promise.reject({message: 'some fields are missing'})
      .catch(_err => {
        console.log(_err)
        return Promise.reject(_err)
      })
  }
  name = safeTrim(name)
  email = safeTrim(email)
  subject = safeTrim(subject)
  message = safeTrim(message)

  if (name === '' ||
      subject === '' ||
      message === '') {
    return Promise.reject({message: 'fields can not be empty'})
  }

  if (!validateEmail(email)) {
    return Promise.reject({message: 'invalid email'})
  }

  let mailData = {
    to: supportEmail,
    subject: `Contact message to The Racing Manager`,
    template: {
      name: 'contactMessage',
      data: {
        name: name,
        email: email,
        subject: subject,
        message: message
      }
    }
  }
  return sendMail(mailData).then(_result => {
    return Promise.resolve()
  }).catch(_err => {
    console.log(_err)
    return Promise.reject(_err)
  })
}

module.exports = {
  contactMessage
}
