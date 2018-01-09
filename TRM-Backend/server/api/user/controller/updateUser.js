const moment = require('moment')

module.exports = (body, {user}) => {
  if (body.birthDate) {
    body.birthDate = moment(body.birthDate, 'DD/MM/YYYY').toDate()
  }
  return Object.assign(
    user, body
  )
    .save()
    .then(() => Promise.resolve())
}
