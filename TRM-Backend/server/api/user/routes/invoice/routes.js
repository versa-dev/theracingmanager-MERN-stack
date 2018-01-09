const express = require('express')
const router = express.Router({mergeParams: true})
const {authenticate} = require('utils/authentication')
const {getInvoices, deleteInvoice, uploadInvoice} = require('./controller')
const {applyController} = require('utils/api')
const handleUpload = require('utils/handleUpload')
const {assignQueryToBody} = require('utils/request')

router.route('/invoice')
  .get(
    authenticate,
    applyController(getInvoices)
  )
  .put(
    authenticate,
    applyController(deleteInvoice)
  )
  .post(
    authenticate,
    handleUpload({
      fields: {
        invoice: {
          type: 'application'
        }
      },
      destination: 'invoices'
    }),
    assignQueryToBody,
    applyController(uploadInvoice)
  )

module.exports = router
