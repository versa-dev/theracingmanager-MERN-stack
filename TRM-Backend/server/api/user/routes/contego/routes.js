const express = require('express')
const router = express.Router({mergeParams: true})

const {contegoVerify} = require('./controller')
const {applyController} = require('utils/api')

const {authenticate} = require('utils/authentication')

router.route('/contego-verify')
  .post(authenticate, applyController(contegoVerify))

module.exports = router
