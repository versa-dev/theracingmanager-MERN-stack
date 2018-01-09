const express = require('express')
const router = express.Router({mergeParams: true})

const {getFutureEntries} = require('./controller')
const {applyController} = require('utils/api')

router.route('/card')
  .post(
    applyController(getFutureEntries)
  )

module.exports = router
