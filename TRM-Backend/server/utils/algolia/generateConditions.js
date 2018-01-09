const {isString, isBoolean, isObject} = require('utils/object')

module.exports = filter => {
  let results = []
  if (filter && filter.length > 0) {
    filter.forEach(condition => {
      if (condition.field) {
        let field = condition.field
        if (condition.value !== undefined) {
          let value = condition.value
          if (isObject(value)) {
            if (value.min) {
              results.push(`${field} >= ${value.min}`)
            }
            if (value.max) {
              results.push(`${field} <= ${value.max}`)
            }
          } else if (isString(value) && value.length > 0) {
            results.push(`${field}:"${value}"`)
          } else if (isBoolean(value)) {
            results.push(`${field}=${value ? 1 : 0}`)
          }
        }
      }
    })
  }
  return results
}
