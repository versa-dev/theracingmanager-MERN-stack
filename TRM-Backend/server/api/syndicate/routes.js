const express = require('express')

const router = express.Router({mergeParams: true})

const handleUpload = require('utils/handleUpload')

const SyndicateController = require('api/syndicate/controller')
const {authenticate} = require('utils/authentication')
const {assignParamsToBody, bodySelect} = require('utils/request')
const {applyController} = require('utils/api')

const routePath = '/syndicate'
const registerRoute = require('./routes/register/routes')

router.use(routePath, registerRoute)

router.route(routePath)
  // TODO: remove this asap when all FE dependencies migrate to /:name route
  .get(
    applyController(SyndicateController.getPublicSyndicate)
  )

router.route(`${routePath}/:name`)
  .put(
    authenticate.can('put syndicate'),
    handleUpload({
      fields: {
        featuredImage: {
          type: 'image'
        },
        logoImage: {
          type: 'image'
        }
      },
      destination: 'syndicate'
    }),
    assignParamsToBody,
    bodySelect([
      'name',
      'featuredImage',
      'logoImage',
      'description',
      'benefits',
      'availability',
      'heritage',
      'trainersHeadline',
      'trainersText',
      'horsesHeadline',
      'horsesText',
      'color',
      'primaryColor',
      'mainColor',
      'bhaApproved',
      'newSyndicate'
    ]),
    applyController(SyndicateController.updateByName)
  )
  .get(
    assignParamsToBody,
    // it will return different sets of horse data depending on if user owns the horse
    authenticate.can('get syndicate', {
      onFail: applyController(SyndicateController.getPublicSyndicate)
    }),
    applyController(SyndicateController.getPrivateSyndicate)
  )

router.route(`${routePath}/registerExisting`)
  .post(
    applyController(SyndicateController.registerExisting)
  )

router.route(`${routePath}/:name/ownership`)
  .get(
    assignParamsToBody,
    applyController(SyndicateController.getOwners)
  )
  .post(
    authenticate.can('put syndicate'),
    assignParamsToBody,
    applyController(SyndicateController.registerOwners)
  )
  .put(
    authenticate.can('put syndicate'),
    assignParamsToBody,
    applyController(SyndicateController.updateOwner)
  )

router.route(`${routePath}/:name/membership`)
  .delete(
    authenticate.can('put syndicate'),
    assignParamsToBody,
    applyController(SyndicateController.removeOwner)
  )

router.route(`${routePath}/:name/message`)
  .post(
    authenticate.can('put syndicate'),
    assignParamsToBody,
    applyController(SyndicateController.message)
  )

router.route(`${routePath}/register`)
  .post(
    authenticate,
    assignParamsToBody,
    applyController(SyndicateController.registerNew)
  )

router.route(`${routePath}/:name/horse`)
  .post(
    authenticate.can('put syndicate'),
    assignParamsToBody,
    applyController(SyndicateController.addHorse)
  )
  .get(
    assignParamsToBody,
    applyController(SyndicateController.getHorses)
  )
  .delete(
    authenticate.can('put syndicate'),
    assignParamsToBody,
    applyController(SyndicateController.removeHorse)
  )

router.route(`${routePath}/:name/members`)
  .post(
    authenticate.can('put syndicate'),
    assignParamsToBody,
    applyController(SyndicateController.addMembers)
  )
  .get(
    assignParamsToBody,
    applyController(SyndicateController.getMembers)
  )
  .delete(
    authenticate.can('put syndicate'),
    assignParamsToBody,
    applyController(SyndicateController.removeMember)
  )

router.route(`${routePath}/:name/shares`)
  .post(
    authenticate.can('put syndicate'),
    assignParamsToBody,
    applyController(SyndicateController.assignShares)
  )
module.exports = router
