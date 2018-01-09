const SECRETKEY = process.env.SECRETKEY
const stripe = require('stripe')(SECRETKEY)

const createCustomer = (des) => {
  return stripe.customers.create({
    description: des
  })
}

const deleteBankAccount = (bankAccountId, customerId) => {
  return stripe.customers.deleteSource(
    customerId,
    bankAccountId
  )
}

const retrieveCustomer = customerId => {
  return stripe.customers.retrieve(customerId)
}

const createSource = (tokenId, customerId) => {
  return stripe.customers.createSource(
    customerId,
    {
      source: tokenId
    }
  )
}

const deleteCardAccount = (cardId, customerId) => {
  return stripe.customers.deleteCard(
    customerId,
    cardId
  )
}

module.exports = {
  createCustomer,
  retrieveCustomer,
  createSource,
  deleteBankAccount,
  deleteCardAccount
}
