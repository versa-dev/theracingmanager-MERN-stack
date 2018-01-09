const {isFunction} = require('utils/object')
const {SUCCESS, ERROR} = require('data/statusCodes')
const success = data => {
  return {status: SUCCESS, data}
}

const error = ({message, errors, status} = {}) => {
  if (!message && !status) message = 'Wrong parameters'
  return {status: status || ERROR, message, errors}
}

const bodyOrQuery = req => (
  Object.keys(req.body).length > 0 ? req.body : req.query
)

const applyController = (controller, options = {}) => {
  return (req, res) => {
    let body = bodyOrQuery(req)
    global.devLog(body)
    options.user = req.user
    if (isFunction(controller)) {
      controller(
        body,
        options
      ).then(result => {
        res.send(success(result))
      }).catch(err => {
        console.log(err)
        if (err && (err.message || err.status)) {
          let errors
          if (err.errors) {
            errors = {}
            Object.keys(err.errors).map(key => {
              let val = err.errors[key]
              errors[key] = [val.message]
            })
          }
          res.status(404).send(error({
            message: err.message,
            errors,
            status: err.status
          }))
        } else { res.status(404).send(error()) }
      })
    } else {
      console.error('Controller is not a function')
      res.status(404).send(error())
    }
  }
}

module.exports = {
  applyController,
  bodyOrQuery,
  error,
  success
}
