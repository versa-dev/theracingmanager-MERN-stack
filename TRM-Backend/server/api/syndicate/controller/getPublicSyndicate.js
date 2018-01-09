const Syndicate = require('api/syndicate/model')
const {prepareQuery} = require('utils/request')
const {hyphenize} = require('utils/transforms')
const {HORSE_CARD_FIELDS} = require('api/horse/model/constants')
const {prepareHorse, getShares} = require('api/horse/utils')
const allowedGetParams = ['name']
const {HorseModel} = require('api/horse/model')
const UserController = require('api/user/controller')
const {getCommentsForHorse} = require('api/message/routes/comment/controller')

module.exports = (body) => {
  body.name = body.syndicateName || body.name
  let query = prepareQuery(
    body,
    allowedGetParams
  )

  let syndicate = {}
  let horses = []

  if (query) {
    return Syndicate.findOne(
      query,
      {__v: 0}
    )
      .populate('horses', HORSE_CARD_FIELDS)
      .lean()
      .then(_syndicate => {
        if (_syndicate === null) {
          return Promise.reject({message: 'invalid syndicate name'})
        }
        syndicate = _syndicate
        syndicate.slug = hyphenize(syndicate.name)
        syndicate.public = true
        syndicate.canEdit = false

        return HorseModel.find({ 'syndicate._id': syndicate._id }).lean().then(_horses => {
          horses = _horses
          let promises = []

          horses.forEach(_horse => {
            _horse.syndicate.name = _syndicate.name
            _horse.syndicate.color = _syndicate.color
            promises.push(getShares(_horse._id))
          })

          return Promise.all(promises)
        }).then(_shares => {
          let promises = []
          horses = horses.map(_horse => {
            let share = _shares.filter(_share => {
              return _horse._id.equals(_share.horseId)
            })[0]
            // _horse.shares = {total: share.numOfOwners, owned: share.owned}
            _horse.shares = {total: share.total, owned: share.owned}
            return _horse
          })
          syndicate.horses = horses.map(horse => {
            return prepareHorse(horse)
          })

          horses.forEach(_horse => {
            promises.push(getCommentsForHorse({horseId: _horse._id}))
          })

          return Promise.all(promises)
        }).then(_comments => {
          let commentCount = 0

          _comments.forEach(_horse => {
            _horse.forEach(_message => {
              commentCount += _message.length
            })
          })

          syndicate.commentCount = commentCount
          return UserController.find()
        }).then(_users => {
          let owners = _users.filter(_u => {
            let hasSyndicate = _u.syndicates.filter(_s => {
              return _s._id.toString() === syndicate._id.toString()
            }).length > 0
            return _u.type === 'owner' && hasSyndicate
          })

          syndicate.owners = owners
          return Promise.resolve(syndicate)
        })
      })
  } else {
    return Promise.reject('Wrong query params')
  }
}
