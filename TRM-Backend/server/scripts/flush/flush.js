require('setup/db').createDBConnection()

const fs = require('fs-extra')

const HorseController = require('api/horse/controller')
const UserController = require('api/user/controller')
const Message = require('api/message/model')
const Comment = require('api/message/routes/comment/model')
const SyndicateController = require('api/syndicate/controller')
const NewsController = require('api/news/controller')

Promise.all([
  HorseController.removeAll(),
  UserController.removeAll(),
  Message.remove({}),
  Comment.remove({}),
  SyndicateController.removeAll(),
  NewsController.removeAll(),
  fs.remove('./uploads')
]).then(() => {
  console.log('Flushed')
  process.exit(0)
}).catch(err => {
  console.log(err.message)
})
