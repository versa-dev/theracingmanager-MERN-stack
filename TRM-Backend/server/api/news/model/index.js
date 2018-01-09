const {removeFilesOnUpdate} = require('utils/mongoose')

const mongoose = require('mongoose')

const NewsSchema = new mongoose.Schema({
  date: Date,
  headline: String,
  slugline: String,
  content: String,
  thumbnailImage: {
    type: String,
    file: true
  }
})

NewsSchema.plugin(removeFilesOnUpdate)

const NewsModel = mongoose.model('News', NewsSchema)

module.exports = NewsModel
