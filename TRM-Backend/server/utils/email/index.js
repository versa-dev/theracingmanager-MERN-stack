const loadTemplate = require('./loadTemplate')
const templates = {
  verification: loadTemplate('verification'),
  joinRequest: loadTemplate('joinRequest'),
  resetPassword: loadTemplate('resetPassword'),
  notification: loadTemplate('notification'),
  contactDetails: loadTemplate('contactDetails'),
  contactMessage: loadTemplate('contactMessage'),
  contegoStatusUpdate: loadTemplate('contegoStatusUpdate')
}

const nodemailer = require('nodemailer')
const mailgunTransport = require('nodemailer-mailgun-transport')

const auth = {
  auth: {
    api_key: process.env.MAILGUN_KEY,
    domain: 'mail.theracingmanager.com'
  }
}

const mailgun = nodemailer.createTransport(mailgunTransport(auth))

const sendMail = _data => {
  if (global.isTest) {
    return Promise.resolve()
  }
  let data = Object.assign({}, _data)
  if (data.template) {
    let template = templates[data.template.name]
    if (!template) {
      throw new Error(`Wrong template: ${data.template.name}`)
    }
    data.html = template(data.template.data)
    delete data.template
  }
  if (!data.from) {
    data.from = `noreply@theracingmanager.com`
  }
  return new Promise((resolve, reject) => {
    mailgun.sendMail(data, (err, info) => {
      if (err) {
        reject(err)
      } else {
        resolve(info)
      }
    })
  })
}

module.exports = {
  sendMail
}
