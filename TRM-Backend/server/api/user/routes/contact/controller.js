const User = require('api/user/model')
const {sendMail} = require('utils/email')
const {CONTACTDETAILS} = require('data/messages')
const jwt = require('jsonwebtoken')

const contactDetails = (body, {user}) => {
  let {email, phoneNumber} = body
  if (!email || !phoneNumber) {
    return Promise.reject({message: CONTACTDETAILS.ERROR.EMPTY_PARAM})
  }
  return User.findOne({_id: user._id})
    .then(_user => {
      if (_user.email === email) {
        User.findOneAndUpdate({
          _id: _user._id
        }, {
          $set: {
            phoneNumber: phoneNumber
          }
        }, {
          new: true,
          upsert: true,
          strict: false
        }).then(_user => {
          if (!_user) {
            return Promise.reject()
          }
        })
        return Promise.resolve({message: CONTACTDETAILS.SUCCESS})
      } else {
        const verification = jwt.sign({
          user: user._id,
          email: email,
          phoneNumber: phoneNumber
        }, process.env.CONTACT_SECRET, {
          expiresIn: '1 days'
        })
        const firstname = _user.firstname
        let baseUrl
        switch (global.nodeEnv) {
          case 'dev':
            baseUrl = '52.51.111.248:3000'
            break
          case 'uat':
            baseUrl = 'uat.theracingmanager.com'
            break
          default:
            baseUrl = 'localhost:8080'
        }
        let verificationUrl = `http://${baseUrl}/user/contact/${verification}`

        let mailData = {
          to: email,
          subject: `Verify your account`,
          template: {
            name: 'contactDetails',
            data: {
              firstname,
              url: verificationUrl
            }
          }
        }
        sendMail(mailData)
        return Promise.resolve({message: CONTACTDETAILS.VERIFY})
      }
    })
}

module.exports = {
  contactDetails
}
