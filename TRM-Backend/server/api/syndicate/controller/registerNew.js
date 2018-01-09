const {sendMail} = require('utils/email')
const {getColor} = require('utils/color')
const {prepareUserData} = require('utils/authentication')
const {hyphenize} = require('utils/transforms')
const Syndicate = require('api/syndicate/model')

module.exports = (body, {user}) => {
  if (!prepareUserData(user).verificationSubmitted) {
    return Promise.reject({message: 'user is not verified yet'})
  }
  if (user.billings === undefined) {
    return Promise.reject({message: 'user does not add payment method yet'})
  }

  let syndicate
  let cardId = user.billings.customer
  let {name, addressLine1, addressLine2, addressCounty, addressCountry, addressPostcode, existingSyndicate, type, ownership, maxMembers} = body
  let newSyndicate = !existingSyndicate
  if (name === undefined ||
    addressLine1 === undefined ||
    addressCountry === undefined ||
    addressPostcode === undefined ||
    type === undefined ||
    ownership === undefined ||
    existingSyndicate === undefined) {
    return Promise.reject({message: 'some fields are missing'})
  }
  if (ownership === 'leased' && maxMembers === undefined) {
    return Promise.reject({message: 'maxMembers is required'})
  }

  return new Promise((resolve, reject) => {
    if (newSyndicate) { // send email to admin
      let mailData = {
        to: `info@theracingmanager.com`,
        subject: `Register New Syndicate`,
        template: {
          name: `notification`,
          data: {
            content: `Hello, Admin Please check syndicate name "${name}"`
          }
        }
      }
      sendMail(mailData).then(_result => {
        return resolve()
      })
    } else {
      return resolve()
    }
  }).then(() => {
    console.log('email sent or existing syndicate')
    let synd = {
      name,
      cardId,
      addressLine1,
      addressLine2,
      addressCounty,
      addressCountry,
      addressPostcode,
      newSyndicate,
      type,
      ownership,
      maxMembers
    }
    synd.owner = {
      firstname: user.firstname,
      surname: user.surname,
      email: user.email
    }
    synd.color = getColor()
    synd.approved = 0
    synd.bhaApproved = false

    return Syndicate.create(synd)
  }).then(_syndicate => {
    syndicate = _syndicate
    user.syndicates.push({_id: _syndicate._id, role: 'manager'})
    return user.save()
  }).then(_user => {
    let synd = syndicate.toObject()
    synd.slug = hyphenize(syndicate.name)
    return Promise.resolve(synd)
  }).catch(_err => {
    console.log(_err)
    return Promise.reject(_err)
  })
}
