const express = require('express')
const router = express.Router({mergeParams: true})

const {searchUser} = require('./controller')
const {applyController} = require('utils/api')

router.route('/search')
  .post(
    applyController(searchUser)
  )

module.exports = router
