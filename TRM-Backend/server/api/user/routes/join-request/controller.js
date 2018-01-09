const {HorseModel} = require('api/horse/model')
const {sendMail} = require('utils/email')
const {METHODS, SYNDICATE} = require('data/messages')
const Syndicate = require('api/syndicate/model')

const joinRequest = (body, {user}) => {
  let {horseName, syndicateName} = body
  if (!horseName && !syndicateName) {
    return Promise.reject({
      message: METHODS.MISSING_PARAMETER('horseName or syndicateName')
    })
  }

  let horse
  return (horseName ? HorseModel.findOne({name: horseName}) : Promise.resolve())
    .then(_horse => {
      horse = _horse
      if (horse) {
        return Syndicate.findOne({horses: horse._id})
      } else if (!syndicateName) {
        return Promise.reject({message: METHODS.NOT_FOUND('horse')})
      } else {
        return Syndicate.findOne({name: syndicateName})
      }
    }).then(syndicate => {
      if (!syndicate) {
        return Promise.reject({message: SYNDICATE.ERROR.NOT_FOUND})
      }
      let mailData = {
        to: `info@theracingmanager.com`,
        subject: `The Racing Manager: Request to join a syndicate`,
        template: {
          name: 'joinRequest',
          data: {
            firstname: user.firstname,
            surname: user.surname,
            email: user.email,
            horse: horse ? horse.name : 'Not selected',
            syndicate: syndicate.name
          }
        }
      }
      sendMail(mailData)
      return Promise.resolve()
    })
}

module.exports = {
  joinRequest
}
