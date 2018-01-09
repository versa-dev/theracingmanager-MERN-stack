const UserController = require('api/user/controller')
const Syndicate = require('api/syndicate/model')
const {safeTrim} = require('utils/object')
const {sendMail} = require('utils/email')
const sendSms = require('utils/twilio')

module.exports = body => {
  let {name, message, members} = body
  let syndicate
  if (message === undefined || safeTrim(message) === '') {
    return Promise.reject({message: 'no message'})
  }
  if (members === undefined || members === '') {
    return Promise.reject({message: 'no members'})
  }

  return Syndicate.findOne({name: name}).then(_syndicate => {
    if (!_syndicate) {
      return Promise.reject({message: 'no syndicate'})
    }
    syndicate = _syndicate
    let promises = []
    members.forEach(_member => {
      promises.push(UserController.findOne({_id: _member}))
    })
    return Promise.all(promises)
  }).then(_members => {
    if (!_members || _members.indexOf(null) >= 0) {
      return Promise.reject({message: 'invalid userId(s)'})
    }

    let isValidSyndicateMembers = true // validate users are member of the syndicate
    for (let member of _members) {
      let role = member.getUserRole(syndicate._id)
      if (role !== 'manager' && role !== 'member') {
        isValidSyndicateMembers = false
        break
      }
    }

    if (!isValidSyndicateMembers) {
      return Promise.reject({message: 'invalid syndicate member(s)'})
    }

    let memberEmails = _members.map(_m => {
      return _m.email
    }).filter(_email => {
      return _email !== undefined
    }).join(', ')

    let promises = []

    let mailData = {
      to: `${memberEmails}`,
      subject: `Hi`,
      template: {
        name: `notification`,
        data: {
          content: `${message}`
        }
      }
    }

    promises.push(sendMail(mailData))

    let memberPhoneNumbers = _members.map(_m => {
      return _m.phoneNumber
    }).filter(_phoneNumber => {
      return _phoneNumber !== undefined
    })

    memberPhoneNumbers.forEach(_phoneNumber => {
      promises.push(sendSms(_phoneNumber, message))
    })

    return Promise.all(promises)
  }).then(_result => {
    return Promise.resolve()
  }).catch(_err => {
    return Promise.reject(_err)
  })
}
