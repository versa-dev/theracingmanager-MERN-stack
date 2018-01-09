const {METHODS} = require('data/messages')
const {safeUpperCase} = require('utils/object')

module.exports = function (_data) {
  let data = Object.assign({}, _data)
  let {name} = data
  delete data.name
  if (!name || name.length === 0) {
    return Promise.reject({message: METHODS.MISSING_PARAMETER('name')})
  }
  data.primaryColor = safeUpperCase(data.primaryColor)
  return this.updateOne({
    query: {
      name: safeUpperCase(name)
    },
    data
  })
    .then(() => (Promise.resolve()))
}
