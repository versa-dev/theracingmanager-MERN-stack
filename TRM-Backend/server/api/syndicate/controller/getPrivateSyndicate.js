const {getMessage} = require('api/message/controller')
const getPublicSyndicate = require('./getPublicSyndicate')
const {getCommentsForMessage} = require('api/message/routes/comment/controller')
const {GENERIC} = require('data/messages')

module.exports = (body, {user}) => {
  let syndicate
  let messages
  return getPublicSyndicate(body)
    .then(_syndicate => {
      syndicate = _syndicate
      if (syndicate) {
        let promises = []
        let ownsSyndicate = (user.getUserRole(syndicate._id) === 'manager')
        syndicate.horses.forEach(horseId => {
          if (ownsSyndicate || user.ownsHorse(horseId._id)) {
            // get messages only for horses user owns(unless is a syndicate owner)
            promises.push(getMessage({
              horseId
            }))
          }
        })
        return Promise.all(promises)
      } else {
        return Promise.reject(GENERIC.NOT_FOUND)
      }
    })
    .then(_messages => {
      let promises = []
      if (_messages) {
        let messagesData = []
        _messages.forEach(m => {
          messagesData = messagesData.concat(m)
        })
        messagesData = messagesData.sort((a, b) => {
          return a.createdAt < b.createdAt
        })
        messages = messagesData
        messages.forEach(_msg => {
          let getComment = getCommentsForMessage({messageId: _msg._id, userId: user._id})
          promises.push(getComment)
        })
      }
      return Promise.all(promises)
    }).then(_comments => {
      messages.forEach(_msg => {
        let comments = _comments.filter(_comment => {
          return _comment.messageId.toString() === _msg._id.toString()
        })[0]
        _msg.commentCount = comments.comments.length
      })
      syndicate.messages = messages
      console.log(syndicate.messages)
      syndicate.public = false
      syndicate.canEdit = (user.getUserRole(syndicate._id) === 'manager')
      return Promise.resolve(syndicate)
    })
}
