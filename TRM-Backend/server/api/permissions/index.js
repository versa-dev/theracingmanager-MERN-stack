const {authenticate} = require('utils/authentication')
const {isMongoId, isString} = require('utils/object')
const Message = require('api/message/model')
const HorseController = require('api/horse/controller')
const { HorseModel } = require('api/horse/model')
const {dehyphenize} = require('utils/transforms')
const SyndicateController = require('api/syndicate/controller')

const ownsSyndicateBySyndicateName = (body, user) => {
  let {name} = body
  if (isString(name) && name.length > 0) {
    return SyndicateController.findOne({name}).select('_id')
      .then(syndicate => {
        if (user.getUserRole(syndicate._id) === 'manager') return Promise.resolve()
        else return Promise.reject()
      })
  }
  return Promise.reject()
}

const ownsSyndicateByHorseName = (body, user) => {
  let {name} = body
  if (name) {
    return HorseController.findOne({name: name})
      .then(_horse => {
        if (!_horse) {
          return Promise.reject({message: 'no hourse found'})
        }
        if (user.getUserRole(_horse.syndicate._id) === 'manager') return Promise.resolve()
        else return Promise.reject()
      })
  }
  return Promise.reject()
}

const ownsHorseByHorseId = (body, user) => {
  let {horseId} = body
  if (user && user.ownsHorse(horseId)) {
    return Promise.resolve()
  }
  return Promise.reject()
}

const ownsHorseByHorseName = (body, user) => {
  let {name} = body
  if (isString(name) && name.length > 0) {
    return HorseController.findOne({
      name
    }).select('owner._id').then(horse => {
      if (user.getUserRole(horse.owner._id) === 'manager') {
        // Syndicate owner is an horse owner by default
        return Promise.resolve()
      } else {
        return ownsHorseByHorseId({
          horseId: horse._id
        }, user)
      }
    })
  }
  return Promise.reject()
}

const ownsHorseBySyndicateName = (body, user) => {
  let {name} = body
  if (name) {
    return SyndicateController.findOne({name}).then(syndicate => {
      if (user.getUserRole(syndicate._id) === 'manager') {
        return Promise.resolve()
      } else {
        name = dehyphenize(name)
        return HorseModel.find({ 'syndicate._id': syndicate._id }).lean().then(_horses => {
          let isOwner = false
          let syndicateHorseIds = _horses.map(h => h._id.toString())
          for (let syndicateHorseId of syndicateHorseIds) {
            if (user.ownsHorse(syndicateHorseId)) {
              isOwner = true
              break
            }
          }

          if (isOwner) {
            return Promise.resolve()
          } else {
            return Promise.reject()
          }
        })
      }
    })
  } else {
    return Promise.reject()
  }
}

const ownsHorseByMessageId = (body, user) => {
  let {messageId} = body
  if (isMongoId(messageId)) {
    return Message.findOne(
      {_id: messageId}
    ).select('horseId').then(message => {
      if (message && message.horseId) {
        return ownsHorseByHorseId(
          {horseId: message.horseId},
          user
        )
      } else {
        return Promise.reject()
      }
    })
  } else {
    return Promise.reject()
  }
}

const canPostMessage = (body, user) => {
  let {horseId, userId} = body
  let canPost = false
  if (!user) {
    canPost = false
  } else {
    if (user.isContentManager) {
      canPost = true
    } else {
      if (user.ownsHorse(horseId)) {
        if (userId) {
          if (userId.toString() === user._id.toString()) {
            canPost = true
          } else {
            canPost = false
          }
        } else {
          canPost = true
        }
      } else {
        canPost = false
      }
    }
  }

  if (canPost) {
    return Promise.resolve()
  } else {
    return Promise.reject({message: 'You do not have permission to post as another user'})
  }
}

authenticate.registerPermission('get syndicate', ownsHorseBySyndicateName)
authenticate.registerPermission('put syndicate', ownsSyndicateBySyndicateName)

authenticate.registerPermission('get horse', ownsHorseByHorseName)
authenticate.registerPermission('put horse', ownsSyndicateByHorseName)

authenticate.registerPermission('get message', ownsHorseByMessageId)
authenticate.registerPermission('post message', canPostMessage)

authenticate.registerPermission('get comment', ownsHorseByMessageId)
authenticate.registerPermission('post comment', ownsHorseByMessageId)
