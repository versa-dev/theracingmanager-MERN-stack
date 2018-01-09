const express = require('express')

const router = express.Router({mergeParams: true})
const searchRoute = require('./routes/search/routes')
const cardRoute = require('./routes/card/routes')
const formRoute = require('./routes/form/routes')
const HorseController = require('api/horse/controller')
const {applyController} = require('utils/api')
const handleUpload = require('utils/handleUpload')
const {checkExist} = require('./utils')

const {authenticate} = require('utils/authentication')
const {assignParamsToBody, bodySelect, dotNotationToObject} = require('utils/request')

const routePath = '/horse'

router.use(routePath, searchRoute)
router.use(routePath, cardRoute)
router.use(routePath, formRoute)

router.route(routePath)
  .get(
    authenticate,
    assignParamsToBody,
    applyController(HorseController.getHorses)
  )

router.route(`${routePath}/:name`)
  .put(
    authenticate.can('put horse'),
    handleUpload({
      fields: {
        featuredImage: {
          type: 'image'
        },
        thumbnailImage: {
          type: 'image'
        }
      },
      destination: 'horses'
    }),
    assignParamsToBody,
    bodySelect([
      'name',
      'featuredImage',
      'thumbnailImage',
      'description',
      'racePlans',
      'horseValue',
      'quote',
      'style',
      'racingType',
      'cost.monthly',
      'cost.initial',
      'ownership.type',
      'ownership.years'
    ]),
    dotNotationToObject,
    applyController(HorseController.updateByName)
  )
  .get(
    assignParamsToBody,
    // it will return different sets of horse data depending on if user owns the horse
    authenticate.can('get horse', {
      onFail: applyController(HorseController.getPublicHorse)
    }),
    applyController(HorseController.getPrivateHorse)
  )

router.route(`${routePath}/checkExist`)
  .post(applyController(checkExist))

module.exports = router
