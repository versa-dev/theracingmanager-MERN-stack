const express = require('express')
const router = express.Router({mergeParams: true})
const {searchHorses} = require('./controller')
const {applyController} = require('utils/api')

router.route('/search')
  .post(
    applyController(searchHorses)
  )

module.exports = router
