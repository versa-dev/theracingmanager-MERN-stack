const express = require('express')

const router = express.Router({mergeParams: true})
const NewsController = require('api/news/controller')
const {applyController} = require('utils/api')
const {assignParamsToBody} = require('utils/request')

const routePath = '/news'
const routePathGetById = '/news/:_id'

router.route(routePath)
  .get(
    applyController(NewsController.getNews)
  )

router.route(routePathGetById)
  .get(
    assignParamsToBody,
    applyController(NewsController.getNewsById)
  )

module.exports = router
