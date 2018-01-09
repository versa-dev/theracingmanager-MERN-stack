const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema.Types

const Message = new Schema({
  horseId: {
    type: ObjectId,
    required: true
  },
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  attachment: {
    type: Array
  },
  text: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Message', Message)
