const User = require('api/user/model')
const {GENERIC} = require('data/messages')
const fileUtils = require('utils/file')

const getInvoices = (body, {user}) => {
  let {pageNum, limit} = body
  pageNum = pageNum && !isNaN(pageNum) && parseInt(pageNum) > 0 ? parseInt(pageNum) - 1 : 0
  limit = limit && !isNaN(limit) ? parseInt(limit) : 5
  return User.findOne({_id: user._id}, 'billings.invoice')
    .then(data => Promise.resolve(data.billings.invoice.slice(pageNum * limit, (pageNum + 1) * limit)))
    .catch(() => Promise.reject({messages: GENERIC.NOT_FOUND}))
}

const deleteInvoice = (body, {user}) => {
  let {invoiceName} = body
  if (!invoiceName) {
    return Promise.reject({message: GENERIC.NOT_FOUND})
  }
  return User.findOneAndUpdate(
    {
      _id: user._id
    },
    {
      $pull: {'billings.invoice': {fileName: invoiceName}}
    }
  ).then(data => {
    let invoices = data.billings.invoice.filter(inv => inv.fileName === invoiceName)
    fileUtils.removeFile(invoices[0].filePath)
  }).then(res => {
    return Promise.resolve()
  }).catch(() => Promise.reject({message: GENERIC.FAILED}))
}

const uploadInvoice = (body, {user}) => {
  if (!body) {
    return Promise.reject({
      message: GENERIC.FAILED
    })
  }
  let {invoice} = body

  let subPaths = invoice.split('/')
  const data = {
    fileName: subPaths[4],
    dateOfUpload: new Date().toLocaleDateString(),
    filePath: invoice
  }

  return User.findOneAndUpdate(
    {
      _id: user._id
    },
    {
      $push: {'billings.invoice': data}
    },
    {
      safe: true, upsert: true, new: true
    }
  ).then(data => {
    return Promise.resolve()
  }).catch({
    mesage: GENERIC.FAILED
  })
}

module.exports = {
  getInvoices,
  deleteInvoice,
  uploadInvoice
}
