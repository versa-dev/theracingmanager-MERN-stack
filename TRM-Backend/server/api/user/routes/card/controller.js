const User = require('api/user/model')
const {GENERIC, SOURCE} = require('data/messages')
const {retrieveCustomer, createSource, createCustomer, deleteCardAccount} = require('utils/stripe')

const createCard = (body, {user}) => {
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
  }).then(card => {
    if (!customerId) {
      return User.update(
        {_id: user._id},
        {
          $set: {'billings.customer': card.customer}
        },
        {upsert: true}
      )
    }
    return Promise.resolve()
  }).then(() => {
    return Promise.resolve()
  }).catch(err => {
    return err instanceof Error ? Promise.reject({message: GENERIC.FAILED}) : Promise.reject(err)
  })
}

const deleteCard = (body, {user}) => {
  let {cardAccountId} = body
  if (!cardAccountId || cardAccountId.trim() === '') {
    return Promise.reject({message: SOURCE.REQUIRED})
  }
  return User.findOne({_id: user._id}, 'billings').then(_billing => {
    let customerId = _billing.billings.customer
    if (!customerId) {
      return Promise.reject({message: GENERIC.NOT_FOUND})
    }
    return retrieveCustomer(customerId)
  }).then(customer => {
    return deleteCardAccount(cardAccountId, customer.id)
  }).then(status => {
    return Promise.resolve()
  }).catch(err => {
    return err instanceof Error ? Promise.reject({message: GENERIC.FAILED}) : Promise.reject(err)
  })
}

const getCardInfos = (body, {user}) => {
  return User.findOne({_id: user._id}, 'billings').then(_billing => {
    let customerId = _billing.billings.customer
    if (!customerId) {
      return Promise.reject({message: GENERIC.EMPTY})
    }
    return retrieveCustomer(customerId)
  }).then(customer => {
    if (customer.sources) {
      let sources = customer.sources.data
      console.log(sources)
      let cardAccounts = sources.filter(src => src.object === 'card')
      if (cardAccounts.length > 0) {
        return Promise.all(cardAccounts.map(card => {
          let response = {
            id: '',
            cardNumber: '',
            expiryMonth: '',
            expiryYear: '',
            postcode: '',
            brand: ''
          }
          response.id = card.id
          response.brand = card.name
          response.cardNumber = `**** **** **** ${card.last4}`
          response.postcode = card.address_zip
          response.expiryMonth = card.exp_month
          response.expiryYear = card.exp_year

          return response
        }))
      }
    }
    return Promise.resolve('')
  }).then(data => {
    return Promise.resolve(data)
  }).catch(err => {
    console.log(err)
    return err instanceof Error ? Promise.reject({message: GENERIC.FAILED}) : Promise.reject(err)
  })
}

module.exports = {
  createCard,
  deleteCard,
  getCardInfos
}
