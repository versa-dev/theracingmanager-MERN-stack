const validator = require('validator')

const {EMAIL, FIRSTNAME} = require('data/messages')

const FIRSTNAME_REG = /^(?=[a-zA-Z-\s]{2,}$)^[a-zA-Z\s]+(-[a-zA-Z\s]+)*$/
const EMAIL_REG = /^[_a-zA-Z0-9-]+(\.[_a-z0-9-]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]{2,})+$/
const PASSWORD_REG = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
const DATE_REG = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/

const CONSTANT = {
  TYPEOFOWNERSHIP: ['Fixed period', 'Open ended'],
  FEES: ['One off all inclusive', 'Ongoing', 'Initial joining fee and ongoing']
}

const FIRSTNAME_VLD = {
  type: String,
  required: FIRSTNAME.REQUIRED,
  validate: {
    message: FIRSTNAME.ERROR,
    validator: FIRSTNAME_REG
  }
}

const EMAIL_VLD = {
  type: String,
  unique: EMAIL.DUPLICATE,
  lowercase: true,
  required: true,
  validate: {
    message: EMAIL.ERROR,
    validator: EMAIL_REG
  }
}

const PASSWORD_VLD = {
  type: String,
  required: true,
  validate: {
    message: 'Passwords must have at least one capital letter, lower case letter, number and be at least 6 characters long.',
    validator: PASSWORD_REG
  }
}

const POSTCODE_VLD = {
  type: String,
  validate: {
    message: 'Please provide valid postcode.',
    validator: (value) => (validator.isPostalCode(value, 'GB'))
  }
}

const FEESTRUCTURE_VLD = (param) => {
  let {ownershipType, kindOfFees, initialFee, monthlyFee, expireDate} = param
  return new Promise((resolve, reject) => {
    if (!ownershipType || !ownershipType.trim() || CONSTANT.TYPEOFOWNERSHIP.indexOf(ownershipType) === -1) {
      return reject({
        message: 'Invalid type of ownership'
      })
    }
    if (!kindOfFees || !kindOfFees.trim() || CONSTANT.FEES.indexOf(kindOfFees) === -1) {
      return reject({
        message: 'Invalid fee'
      })
    }
    if (!initialFee || (typeof initialFee === 'string' && initialFee.trim() === '') || isNaN(initialFee)) {
      return reject({
        message: 'Invalid initial fee'
      })
    }
    if (!monthlyFee || (typeof monthlyFee === 'string' && monthlyFee.trim() === '') || isNaN(monthlyFee)) {
      return reject({
        message: 'Invalid monthly fee'
      })
    }
    if (!expireDate || !DATE_REG.test(expireDate)) {
      return reject({
        message: 'Invalid expire date'
      })
    }

    return resolve(param)
  })
}

const validateEmail = email => {
  return EMAIL_REG.test(email)
}

module.exports = {
  FIRSTNAME_VLD,
  EMAIL_VLD,
  PASSWORD_VLD,
  POSTCODE_VLD,
  FEESTRUCTURE_VLD,
  validateEmail
}
