const express = require('express')
const router = express.Router({mergeParams: true})
const {contactMessage} = require('./controller')
const {applyController} = require('utils/api')
const {authenticate} = require('utils/authentication')

router.route('/contact')
  .post(authenticate, applyController(contactMessage))

module.exports = router
