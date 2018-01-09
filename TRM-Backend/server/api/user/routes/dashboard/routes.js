const express = require('express')
const router = express.Router({mergeParams: true})

const {applyController} = require('utils/api')
const {getDashboard} = require('./controller')
const {authenticate} = require('utils/authentication')

router.route('/dashboard')
  .get(authenticate, applyController(getDashboard))

module.exports = router
