const express = require('express')
const router = express.Router({mergeParams: true})
const {changePwd} = require('./controller')
const {applyController} = require('utils/api')
const {authenticate} = require('utils/authentication')

router.route('/change-password')
  .put(authenticate, applyController(changePwd))

module.exports = router
