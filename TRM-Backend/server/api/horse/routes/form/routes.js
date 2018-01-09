const express = require('express')
const router = express.Router({mergeParams: true})

const {getForm} = require('./controller')
const {applyController} = require('utils/api')

router.route('/form')
  .post(
    applyController(getForm)
  )

module.exports = router
