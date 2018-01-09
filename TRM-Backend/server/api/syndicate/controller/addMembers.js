const UserController = require('api/user/controller')
const Syndicate = require('api/syndicate/model')
const {prepareUserData} = require('utils/authentication')
const {sendMail} = require('utils/email')
const {getResetPasswordToken} = require('utils/authentication')

module.exports = (body, {user}) => {
  let syndicateName = body.name
  let {email, firstname, surname} = body

  if (email === undefined) {
    return Promise.reject({message: 'email is missing'})
  }
  return Syndicate.findOne({name: syndicateName}).then(_syndicate => {
    if (!_syndicate) {
      return Promise.reject({message: 'syndicate does not exist'})
    }

    return UserController.findOne({email: email}).then(_user => {
      if (_user) { // exisitng user
        let hasOwn = false
        let syndicates = _user.syndicates
        syndicates.forEach(s => {
          if (s._id.toString() === _syndicate._id.toString()) {
            hasOwn = true
          }
        })

        let role = prepareUserData(user).verificationSubmitted ? 'member' : 'pending'

        if (!hasOwn) {
          syndicates.push({_id: _syndicate._id, role: role})
        } else {
          return Promise.reject({message: 'user is already owner of syndicate'})
        }

        _user.syndicates = syndicates
        return _user.save().then(_result => {
          return Promise.resolve(_result)
        }).catch(_err => {
          console.log(_err)
          return Promise.reject(_err)
        })
      } else { // new user
        if (firstname === undefined || surname === undefined) {
          return Promise.reject({message: 'invalid paramaters'})
        }
        let member = {
          email,
          firstname,
          surname,
          password: 'Demo12'
        }
        member.syndicates = {_id: _syndicate._id, role: 'pending'}
        let newMember
        return UserController.updateOrCreate({query: {}, data: member}).then(_member => {
          newMember = _member

          const token = getResetPasswordToken(newMember)
          let mailData = {
            to: newMember.email,
            subject: `The Racing Manager Reset Password`,
            template: {
              name: 'resetPassword',
              data: {
                firstname: newMember.firstname,
                token: token
              }
            }
          }

          return sendMail(mailData)
        }).then(_result => {
          return Promise.resolve(newMember)
        }).catch(_err => {
          console.log(_err)
          return Promise.reject(_err)
        })
      }
    }).catch(_err => {
      console.log(_err)
      return Promise.reject(_err)
    })
  }).catch(_err => {
    console.log(_err)
    return Promise.reject(_err)
  })
}
