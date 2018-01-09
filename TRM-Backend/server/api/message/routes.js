const express = require('express')
const {applyController} = require('utils/api')
const handleUpload = require('utils/handleUpload')

const commentRoute = require('./routes/comment/routes')

const router = express.Router({mergeParams: true})
const {getMessage, createMessage} = require('./controller')
const {authenticate} = require('utils/authentication')
const {assignQueryToBody} = require('utils/request')

const routePath = '/message'

router.use(routePath, commentRoute)

router.route(routePath)
  .get(
    authenticate.can('get message'),
    applyController(getMessage)
  )
  .post(
    authenticate.can('post message'),
    handleUpload({
      fields: {
        attachment: {
          type: ['video', 'image', 'audio'],
          limit: 15
        }
      },
      destination: 'messages'
    }),
    assignQueryToBody,
    applyController(createMessage)
  )

module.exports = router
