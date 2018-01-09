const express = require('express')
const router = express.Router({mergeParams: true})
const {createCard, deleteCard, getCardInfos} = require('./controller')
const {applyController} = require('utils/api')
const {authenticate} = require('utils/authentication')

router.route('/card')
  .post(
    authenticate,
    applyController(createCard)
  )
  .put(
    authenticate,
    applyController(deleteCard)
  )
  .get(
    authenticate,
    applyController(getCardInfos)
  )
module.exports = router
