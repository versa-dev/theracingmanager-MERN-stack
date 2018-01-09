const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema.Types

const Comment = new Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  messageId: {
    type: ObjectId,
    ref: 'Message',
    required: true
  },
  text: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Comment', Comment)
