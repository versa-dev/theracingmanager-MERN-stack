const express = require('express')
const router = express.Router({mergeParams: true})
const {forgottenPassword} = require('./controller')
const {applyController} = require('utils/api')

router.route('/forgotten-password')
  .post(applyController(forgottenPassword))

module.exports = router
