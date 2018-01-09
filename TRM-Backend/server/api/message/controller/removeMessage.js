const Message = require('api/message/model')

const removeMessage = (body = {}) => {
  return Message.remove(body)
}

module.exports = removeMessage
