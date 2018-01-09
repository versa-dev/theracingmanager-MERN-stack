const express = require('express')
const router = express.Router({mergeParams: true})
const {getNotifyOptions, updateNotifyOptions} = require('./controller')
const {applyController} = require('utils/api')
const {authenticate} = require('utils/authentication')

router.route('/notification')
  .get(
    authenticate,
    applyController(getNotifyOptions)
  )
  .put(
    authenticate,
    applyController(updateNotifyOptions)
  )

module.exports = router
