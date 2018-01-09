const request = require('request-promise')

let data = {
  grant_type: 'password',
  username: 'jacob@vitaminlondon.com',
  password: process.env.TIMEFORM_PASS
}

module.exports = request.post('https://sso.timeform.com/Token', {
  form: data
})
