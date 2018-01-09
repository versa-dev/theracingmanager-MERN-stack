const express = require('express')
const router = express.Router({mergeParams: true})

const {verifyUser} = require('./controller')
const {applyController} = require('utils/api')

router.route('/verify/contact')
  .post(applyController(verifyUser))

module.exports = router
