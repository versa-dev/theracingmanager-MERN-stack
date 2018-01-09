const express = require('express')

const router = express.Router({mergeParams: true})
const {applyController} = require('utils/api')
const {getAttributes} = require('./controller')

router.route('/attributes')
  .get(applyController(getAttributes))

module.exports = router
