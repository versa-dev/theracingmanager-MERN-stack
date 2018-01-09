const express = require('express')
const router = express.Router({mergeParams: true})
const {loginUser} = require('./controller')
const {applyController} = require('utils/api')

router.route('/login')
  .post(applyController(loginUser))

module.exports = router
