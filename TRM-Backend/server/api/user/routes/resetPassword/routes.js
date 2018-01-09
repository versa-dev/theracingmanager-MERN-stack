const express = require('express')
const router = express.Router({mergeParams: true})
const {resetPassword} = require('./controller')
const {applyController} = require('utils/api')

router.route('/reset-password')
  .post(applyController(resetPassword))

module.exports = router
