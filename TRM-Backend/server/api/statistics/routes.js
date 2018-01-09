const express = require('express')

const router = express.Router({mergeParams: true})
const {applyController} = require('utils/api')
const {authenticate} = require('utils/authentication')
const {getRanking} = require('./controller')
const {getEntries} = require('./controller')
const {getEntry} = require('./controller')
const {getResults} = require('./controller')
const {getResult} = require('./controller')

const {assignParamsToBody} = require('utils/request')
const routePath = '/horse/:slug'

router.route(`${routePath}/ranking`)
  .get(authenticate, assignParamsToBody, applyController(getRanking))

router.route(`${routePath}/entries`)
  .get(authenticate, assignParamsToBody, applyController(getEntries))

router.route(`${routePath}/entries/:meetingDate`)
  .get(authenticate, assignParamsToBody, applyController(getEntry))

router.route(`${routePath}/results`)
  .get(authenticate, assignParamsToBody, applyController(getResults))

router.route(`${routePath}/results/:meetingDate`)
  .get(authenticate, assignParamsToBody, applyController(getResult))

module.exports = router
