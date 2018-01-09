const express = require('express')
const router = express.Router({mergeParams: true})
const {getFeeInfos, updateFeeInfos} = require('./controller')
const {applyController} = require('utils/api')
const {authenticate} = require('utils/authentication')

router.route('/fee')
  .get(
    authenticate,
    applyController(getFeeInfos)
  )
  .put(
    authenticate,
    applyController(updateFeeInfos)
  )

module.exports = router
