const express = require('express')

const router = express.Router({mergeParams: true})
const {getSetup} = require('./controller')
const {applyController} = require('utils/api')
const {authenticate} = require('utils/authentication')

router.route('/setup')
  .get(authenticate, applyController(getSetup))

module.exports = router
