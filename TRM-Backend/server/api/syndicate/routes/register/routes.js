const express = require('express')
const router = express.Router({mergeParams: true})

const {applyController} = require('utils/api')
const {assignParamsToBody} = require('utils/request')
const {registerName,
  updateName,
  registerHorses,
  updateColor,
  registerOwners,
  updateOwners,
  updateShares,
  registerTeam
} = require('./controller')
const {authenticate} = require('utils/authentication')

const routePath = '/register'

router.route(`${routePath}/name`)
  .post(authenticate, applyController(registerName))

router.route(`${routePath}/name/:name`)
  .put(authenticate.can('put syndicate'), assignParamsToBody, applyController(updateName))

router.route(`${routePath}/horses/:name`)
  .post(authenticate.can('put syndicate'), assignParamsToBody, applyController(registerHorses))

router.route(`${routePath}/color/:name`)
  .put(authenticate.can('put syndicate'), assignParamsToBody, applyController(updateColor))

router.route(`${routePath}/owners/members/:name`)
  .post(authenticate.can('put syndicate'), assignParamsToBody, applyController(registerOwners))
  .put(authenticate.can('put syndicate'), assignParamsToBody, applyController(updateOwners))

router.route(`${routePath}/owners/shares/:name`)
  .put(authenticate.can('put syndicate'), assignParamsToBody, applyController(updateShares))

router.route(`${routePath}/owners/:name`)
  .put(authenticate.can('put syndicate'), assignParamsToBody, applyController(registerTeam))

module.exports = router
