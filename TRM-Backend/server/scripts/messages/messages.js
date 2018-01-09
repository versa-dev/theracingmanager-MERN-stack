require('dotenv').config()
require('setup/db').createDBConnection()

const fs = require('fs-extra')

const {HorseModel} = require('api/horse/model')
const {createMessage} = require('api/message/controller')
const UserController = require('api/user/controller')
const {mockFileUpload} = require('utils/mock')
const {processMulterFiles} = require('utils/request')

const messages = require('./messageData')

const _createMessage = (horseName, _data, user) => {
  let data = Object.assign({}, _data)
  let files = []
  if (data.attachment) {
    if (Array.isArray(data.attachment)) {
      data.attachment.forEach(att => {
        files.push(mockFileUpload(
          'attachment',
          `messages/${att}`
        ))
      })
    } else {
      files.push(mockFileUpload(
        'attachment',
        `messages/${data.attachment}`
      ))
    }
  }
  console.log(`Creating message for ${horseName}`)
  return processMulterFiles(
    files, 'array', 'attachment', 'messages'
  ).then(files => {
    if (files && files.length > 0) {
      data.attachment = files
    }
    let query = {name: horseName.toUpperCase()}
    return HorseModel.findOne(
      query,
      {_id: true}
    )
  }).then(horse => {
    data.horseId = horse._id
    return createMessage(data, {user})
  }).catch((err) => {
    console.log(err)
  })
}

fs.copy(
  './seed/messages', './uploads/tmp/messages'
).then(() => {
  return UserController.findOne({email: 'demo@vitaminlondon.com'})
}).then(user => {
  let promises = []

  messages.forEach(messageData => {
    messageData.messages.forEach(message => {
      promises.push(_createMessage(messageData.horseName, message, user))
    })
  })
  return Promise.all(promises)
}).then(() => {
  console.log('Messages created')
  process.exit(0)
}).catch(err => {
  console.log(err)
  process.exit(0)
})
