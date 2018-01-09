const validator = require('validator')

const isObject = obj => {
  return obj != null && typeof obj === 'object' && Array.isArray(obj) === false
}

const isString = elem => (typeof elem === 'string' || elem instanceof String)

const isBoolean = elem => (typeof elem === 'boolean')

const isFunction = elem => {
  return elem && {}.toString.call(elem) === '[object Function]'
}

const isMongoId = elem => {
  if (isString(elem)) {
    return validator.isMongoId(elem)
  } else if (isObject(elem)) {
    return validator.isMongoId(elem.toString())
  } else return false
}

const removePrivate = obj => {
  const result = {}
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    if (key[0] !== '_') {
      result[key] = value
    }
  })
  return result
}

const removeEmpty = obj => {
  if (!isObject(obj)) return obj
  let result = {}
  Object.keys(obj).forEach(key => {
    let val = obj[key]
    if (val !== undefined && val !== null && val !== '') {
      result[key] = val
    }
  })
  return result
}

const cloneObject = obj => (JSON.parse(JSON.stringify(obj)))

const safeTrim = (val) => (isString(val) ? val.trim() : val)

const safeLowerCase = (val) => (isString(val) ? val.toLowerCase() : val)

const safeUpperCase = (val) => (isString(val) ? val.toUpperCase() : val)

module.exports = {
  isObject,
  isString,
  isBoolean,
  isFunction,
  isMongoId,
  removePrivate,
  removeEmpty,
  cloneObject,
  safeTrim,
  safeLowerCase,
  safeUpperCase
}
