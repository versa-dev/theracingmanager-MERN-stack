const {isObject} = require('utils/object')
const {horseDefinition} = require('api/horse/model')

const selectFields = (body, fields) => {
  const result = {}
  Object.keys(fields).forEach(key => {
    const value = fields[key]
    if (isObject(value)) {
      if (value.tf !== undefined) {
        if (body[value.tf]) {
          result[key] = body[value.tf]
        }
      } else {
        const newValue = selectFields(body, value)
        if (Object.keys(newValue).length > 0) {
          result[key] = newValue
        }
      }
    }
  })
  return result
}

const convertFields = {
  horse: body => {
    return selectFields(body, horseDefinition)
  },
  performance: body => {
    return selectFields(body, horseDefinition.performances[0])
  }
}

module.exports = convertFields
