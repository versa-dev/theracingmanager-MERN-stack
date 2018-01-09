const {HorseModel} = require('api/horse/model')
const UserModel = require('api/user/model')
const SyndicateModel = require('api/syndicate/model')
const {prepareQuery} = require('utils/request')
const {prepareHorse} = require('api/horse/utils')
const {getPublicSyndicate} = require('api/syndicate/controller')
const {METHODS} = require('data/messages')
const availableQueries = ['name', '_id']
const {getCommentsForHorse} = require('api/message/routes/comment/controller')

module.exports = body => {
  body.name = body.horseName || body.name
  let query = prepareQuery(body, availableQueries)
  if (query) {
    let horse
    return HorseModel.findOne(
      query,
      {__v: 0, timeformId: 0}
    ).lean().then(_horse => {
      if (_horse) {
        horse = _horse
        return getCommentsForHorse({horseId: _horse._id})
      } else {
        return Promise.reject(new Error(METHODS.HORSE.NOT_FOUND(query.name || query._id)))
      }
    }).then(_comments => {
      let commentCount = 0
      _comments.forEach(_message => {
        commentCount += _message.length
      })
      horse.commentCount = commentCount
      return SyndicateModel.findOne({_id: horse.syndicate._id})
    }).then(_syndicate => {
      horse.syndicate.name = _syndicate.name
      horse.syndicate.color = _syndicate.color
      horse = prepareHorse(horse)
      return getPublicSyndicate({
        name: horse.syndicate.name
      })
    }).then(syndicate => {
      if (syndicate) {
        if (horse.owner === undefined) {
          horse.owner = {}
          horse.owner.name = syndicate.name
        }
        horse.owner.color = syndicate.color
      }

      let totalShares = 0
      let totalSharesPercent = 0
      return UserModel.find().then(_users => {
        _users.forEach(user => {
          if (user.ownership) {
            user.ownership.forEach(share => {
              if (share.horse.equals(horse._id)) {
                totalShares += 1
                totalSharesPercent += share.shares
              }
            })
          }
        })

        // horse.shares = {numOfOwners: totalShares, owned: totalSharesPercent}
        horse.shares = {total: totalShares, owned: totalSharesPercent}
        horse.public = true
        horse.canEdit = false
        return Promise.resolve(horse)
      })
    })
  } else {
    return Promise.reject()
  }
}
