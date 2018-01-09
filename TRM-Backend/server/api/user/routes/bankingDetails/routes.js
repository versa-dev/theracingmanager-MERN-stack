const express = require('express')
const router = express.Router({mergeParams: true})
const {createBank, deleteBank} = require('./controller')
const {applyController} = require('utils/api')
const {authenticate} = require('utils/authentication')

router.route('/banking')
  .post(
    authenticate,
    applyController(createBank)
  )
  .put(
    authenticate,
    applyController(deleteBank)
  )

module.exports = router
