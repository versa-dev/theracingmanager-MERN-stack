const UserController = require('api/user/controller')
const Syndicate = require('api/syndicate/model')
const {sendMail} = require('utils/email')
const {getResetPasswordToken} = require('utils/authentication')

module.exports = (body) => {
  let syndicateName = body.name
  let shareDistribution = body.shareDistribution
  let newUsers = []
  return Syndicate.findOne({name: syndicateName}).then(_syndicate => {
    if (!_syndicate) {
      return Promise.reject({message: 'syndicate does not exist'})
    }
    if (body.userId !== undefined) { // plan-A
      let userId = body.userId
      return UserController.findOne({_id: userId}).then(_user => {
        if (!_user) {
          return Promise.reject({message: 'user does not exist'})
        } else {
          let hasOwn = false
          let syndicates = _user.syndicates
          syndicates.forEach(s => {
            if (s._id.toString() === _syndicate._id.toString()) {
              hasOwn = true
            }
          })

          if (!hasOwn) {
            syndicates.push({_id: _syndicate._id, owned: shareDistribution})
          } else {
            return Promise.reject({message: 'user is already owner of syndicate'})
          }

          _user.syndicates = syndicates
          return _user.save()
        }
      }).then(_result => {
        return Promise.resolve({userId: userId})
      })
    } else { // plan-B
      let promises = []
      let owners = body.owners
      owners.forEach(_owner => {
        _owner.type = 'owner'
        _owner.syndicates = {_id: _syndicate._id, owned: _owner.shareDistribution}
        let createOwner = UserController.updateOrCreate({query: {}, data: _owner})
        promises.push(createOwner)
      })
      return Promise.all(promises).then(_users => {
        newUsers = _users
        let promises = []
        _users.forEach(user => {
          const token = getResetPasswordToken(user)
          let mailData = {
            to: user.email,
            subject: `The Racing Manager Reset Password`,
            template: {
              name: 'resetPassword',
              data: {
                firstname: user.firstname,
                token: token
              }
            }
          }
          promises.push(sendMail(mailData))
        })
        return Promise.all(promises)
      }).then(_result => {
        return Promise.resolve(newUsers)
      })
    }
  })
}
