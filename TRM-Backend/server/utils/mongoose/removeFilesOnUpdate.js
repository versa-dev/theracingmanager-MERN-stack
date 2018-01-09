const {removeFile} = require('utils/file')

module.exports = function (schema) {
  Object.keys(schema.tree).forEach(key => {
    let field = schema.tree[key]
    if (field.file) {
      schema.path(key).set(function (newVal) {
        let oldVal = this[key]
        if (!field.default || oldVal !== field.default) {
          removeFile(oldVal)
        }
        return newVal
      })
    }
  })
}
