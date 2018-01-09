const express = require('express')
const router = express.Router({mergeParams: true})
const {joinRequest} = require('./controller')
const {applyController} = require('utils/api')
const {authenticate} = require('utils/authentication')

router.route('/join-request')
  .post(authenticate, applyController(joinRequest))

module.exports = router
