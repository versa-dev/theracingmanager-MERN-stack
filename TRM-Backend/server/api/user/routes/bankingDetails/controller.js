const User = require('api/user/model')
const {GENERIC, SOURCE} = require('data/messages')
const {createSource, deleteBankAccount, retrieveCustomer, createCustomer} = require('utils/stripe')

const createBank = (body, {user}) => {
  let {tokenId} = body
  if (!tokenId || tokenId.trim() === '') {
    return Promise.reject({message: SOURCE.TOKEN})
  }
  let customerId
  return User.findOne({_id: user._id}, 'billings').then(_billing => {
    customerId = _billing.billings.customer
    if (!customerId) {
      return createCustomer(user.email)
    }
    return retrieveCustomer(customerId)
  }).then(customer => {
    return createSource(tokenId, customer.id)
  }).then(bankAccount => {
    if (!customerId) {
      return User.update(
        {_id: user._id},
        {
          $set: {'billings.customer': bankAccount.customer}
        },
        {upsert: true}
      )
    }
    return Promise.resolve()
  }).then(data => {
    return Promise.resolve()
  }).catch(err => {
    return err instanceof Error ? Promise.reject({message: GENERIC.FAILED}) : Promise.reject(err)
  })
}

const deleteBank = (body, {user}) => {
  let {bankAccountId} = body
  if (!bankAccountId && bankAccountId.trim() === '') {
    return Promise.reject({message: SOURCE.REQUIRED})
  }
  let customerId
  return User.findOne({_id: user._id}, 'billings').then(_billing => {
    customerId = _billing.billings.customer
    if (!customerId) {
      return Promise.reject({message: GENERIC.NOT_FOUND})
    }
    return retrieveCustomer(customerId)
  }).then(customer => {
    return deleteBankAccount(bankAccountId, customer.id)
  }).then(bankAccount => {
    return Promise.resolve()
  }).catch(err => {
    return err instanceof Error ? Promise.reject({message: GENERIC.FAILED}) : Promise.reject(err)
  })
}

module.exports = {
  createBank,
  deleteBank
}
