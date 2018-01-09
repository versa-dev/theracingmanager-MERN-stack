const express = require('express')
const router = express.Router({mergeParams: true})

const {registerUser} = require('./controller')
const {applyController} = require('utils/api')

router.route('/register')
  .post(applyController(registerUser))

module.exports = router
