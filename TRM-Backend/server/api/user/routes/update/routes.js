const express = require('express')
const router = express.Router({mergeParams: true})

const {updateUser} = require('./controller')
const {applyController} = require('utils/api')

router.route('/update')
  .post(
    applyController(updateUser)
  )

module.exports = router
