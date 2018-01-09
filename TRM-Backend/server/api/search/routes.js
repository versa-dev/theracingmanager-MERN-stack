const express = require('express')

const router = express.Router({mergeParams: true})
const attributesRoute = require('./attributes/routes')

const {searchHorse} = require('api/horse/controller')
const {applyController} = require('utils/api')

let routePath = '/search'
router.route(routePath)
  .post(applyController(searchHorse))

router.use(routePath, attributesRoute)

module.exports = router
