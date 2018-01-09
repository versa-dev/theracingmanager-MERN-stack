const {getMessage} = require('api/message/controller')
const {getShares} = require('api/user/controller')
const {getCommentsForMessage} = require('api/message/routes/comment/controller')

module.exports = function (body, {user}) {
  let result
  let messages
  return this.getPublicHorse(
    body
  ).then(horse => {
    result = horse
    return getMessage(
      {horseId: horse._id}
    )
  }).then(_messages => {
    messages = _messages
    let promises = []
    messages.forEach(_msg => {
      let getComment = getCommentsForMessage({messageId: _msg._id, userId: user._id})
      promises.push(getComment)
    })
    return Promise.all(promises)
  }).then(_comments => {
    messages.forEach(_msg => {
      let comments = _comments.filter(_comment => {
        return _comment.messageId.toString() === _msg._id.toString()
      })[0]
      _msg.commentCount = comments.comments.length
    })
    result.messages = messages
    return getShares({
      horseId: result._id
    })
  }).then(shares => {
    result.shares = shares
    result.public = false
    result.canEdit = (user.getUserRole(result.owner._id) === 'manager')
    return Promise.resolve(result)
  })
}
