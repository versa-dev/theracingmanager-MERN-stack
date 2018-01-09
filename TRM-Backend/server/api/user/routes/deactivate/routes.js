const express = require('express')
const router = express.Router({mergeParams: true})
const {deactivateUser} = require('./controller')
const {applyController} = require('utils/api')
const {authenticate} = require('utils/authentication')

router.route('/deactivate')
  .put(authenticate, applyController(deactivateUser))

module.exports = router
