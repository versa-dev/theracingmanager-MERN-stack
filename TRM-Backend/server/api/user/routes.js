const express = require('express')

const router = express.Router({mergeParams: true})

const dashboardRoute = require('./routes/dashboard/routes')
const registerRoute = require('./routes/register/routes')
const loginRoute = require('./routes/login/routes')
const verifyRoute = require('./routes/verify/routes')
const updateRoute = require('./routes/update/routes')
const changePasswordRoute = require('./routes/changePassword/routes')
const deactivateRoute = require('./routes/deactivate/routes')
const joinRoute = require('./routes/join-request/routes')
const notificationRoute = require('./routes/notification/routes')

const contegoVerifyRoute = require('./routes/contego/routes')

const contactRoute = require('./routes/contact/routes')
const contactVerifyRoute = require('./routes/verify-contact/routes')

const feeSettingRouter = require('./routes/feeSetting/routes')
const bankingDetailsRouter = require('./routes/bankingDetails/routes')
const invoiceRouter = require('./routes/invoice/routes')
const cardRouter = require('./routes/card/routes')
const forgottenPasswordRoute = require('./routes/forgottenPassword/routes')
const resetPasswordRoute = require('./routes/resetPassword/routes')
const searchUserRoute = require('./routes/search/routes')

const routePath = '/user'

router.use(routePath, dashboardRoute)
router.use(routePath, registerRoute)
router.use(routePath, loginRoute)
router.use(routePath, verifyRoute)
router.use(routePath, updateRoute)
router.use(routePath, changePasswordRoute)
router.use(routePath, deactivateRoute)
router.use(routePath, joinRoute)
router.use(routePath, notificationRoute)

router.use(routePath, contegoVerifyRoute)

router.use(routePath, contactRoute)
router.use(routePath, contactVerifyRoute)

router.use(routePath, feeSettingRouter)
router.use(routePath, bankingDetailsRouter)
router.use(routePath, invoiceRouter)
router.use(routePath, cardRouter)
router.use(routePath, forgottenPasswordRoute)
router.use(routePath, resetPasswordRoute)
router.use(routePath, searchUserRoute)

const handleUpload = require('utils/handleUpload')

const {applyController} = require('utils/api')
const UserController = require('api/user/controller')
const {authenticate} = require('utils/authentication')
const {bodySelect} = require('utils/request')

router.route(routePath)
  .get(
    authenticate,
    applyController(UserController.getUser)
  )
  .put(
    authenticate,
    handleUpload({
      fields: {
        avatarImage: {
          type: 'image'
        }
      },
      destination: 'users'
    }),
    bodySelect([
      'avatarImage',
      'firstname',
      'surname',
      'username',
      'birthDate',
      'location',
      'active'
    ]),
    applyController(UserController.updateUser)
  )

module.exports = router
