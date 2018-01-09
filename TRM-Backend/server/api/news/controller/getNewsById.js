const NewsModel = require('api/news/model')

const getNewsById = body => {
  let newsId = body._id

  if (newsId.match(/^[0-9a-fA-F]{24}$/)) {
    return NewsModel.findById(newsId).then(_aNews => {
      if (!_aNews) {
        return Promise.reject({ message: 'no news' })
      }
      return Promise.resolve(_aNews)
    }).catch(_err => {
      return Promise.reject(_err)
    })
  } else {
    return Promise.reject({ message: 'invalid news id' })
  }
}

module.exports = {
  getNewsById
}
