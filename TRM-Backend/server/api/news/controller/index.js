const {Controller} = require('api/utils')
const NewsModel = require('api/news/model')
const {getNewsById} = require('./getNewsById')

const NewsController = new Controller({
  model: NewsModel,
  methods: {
    getNews: require('./getNews'),
    getNewsById: getNewsById
  }
})

module.exports = NewsController
