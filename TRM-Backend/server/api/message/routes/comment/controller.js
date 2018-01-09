const {getMessage} = require('api/message/controller')
const Comment = require('./model')
const {getUserDisplayName} = require('api/user/utils')
const {COMMENT} = require('data/messages')

const createComment = (body, {user} = {}) => {
  const {messageId, text} = body

  if (user && messageId && text) {
    const userId = user._id
    return Comment.create({
      messageId, text, userId
    }).then(() => {
      return Promise.resolve(COMMENT.SUCCESS)
    })
  } else {
    return Promise.reject()
  }
}

const getComment = body => {
  const {messageId} = body

  if (messageId) {
    return Comment.find({
      messageId
    },
    {_id: 0, __v: 0}
    ).limit(30).sort({createdAt: -1}).lean().populate(
      'userId'
    ).then(comments => {
      return Promise.resolve(comments.map(comment => {
        comment.author = getUserDisplayName(comment.userId)
        delete comment.userId
        return comment
      }))
    })
  } else {
    return Promise.reject()
  }
}

const getCommentsForHorse = body => {
  let {horseId} = body
  return getMessage(
    {horseId: horseId}
  ).then(_messages => {
    let promises = []
    _messages.forEach(_message => {
      let comment = Comment.find({messageId: _message._id},
        {_id: 0, __v: 0}
      ).sort({createdAt: -1})
      promises.push(comment)
    })
    return Promise.all(promises)
  }).then(_comments => {
    return Promise.resolve(_comments)
  })
}
const getCommentsForMessage = body => {
  let {messageId} = body
  let query

  query = {messageId: messageId}

  return Comment.find(query,
    {__v: 0}).sort({createdAt: -1}).then(_comments => {
    return Promise.resolve({messageId: messageId, comments: _comments})
  })
}

module.exports = {
  createComment,
  getComment,
  getCommentsForHorse,
  getCommentsForMessage
}
