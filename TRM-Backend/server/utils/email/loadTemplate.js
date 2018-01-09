const Handlebars = require('handlebars')
const fs = require('fs')

module.exports = filePath => {
  return Handlebars.compile(fs.readFileSync(`${__dirname}/templates/${filePath}.hbs`).toString())
}
