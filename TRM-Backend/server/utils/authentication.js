const passport = require('passport')
const jwt = require('jsonwebtoken')
const {NOT_VERIFIED, NOT_AUTHORIZED} = require('data/statusCodes')
const {VERIFICATION, AUTHENTICATION} = require('data/messages')
const {error, bodyOrQuery} = require('utils/api')
const {isString, isFunction} = require('utils/object')
const {assignParamsToBody} = require('utils/request')

const authenticate = (req, res, next) => {
  authenticate.onFail()(req, res, next)
}

authenticate.sendNotAuthorized = (req, res) => {
  res.status(401).send(error({status: NOT_AUTHORIZED, message: AUTHENTICATION.ERROR}))
}

authenticate.onFail = (onFail) => (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, user) => {
    if (err || !user) {
      if (isFunction(onFail)) {
        onFail(req, res, next)
      } else {
        authenticate.sendNotAuthorized(req, res)
      }
    } else {
      req.user = user
      next()
    }
  })(req, res, next)
}

let permissions = {}

authenticate.registerPermission = (action, promise) => {
  if (!permissions[action]) {
    permissions[action] = []
  }
  permissions[action].push(promise)
}

authenticate.can = (actions = [], {onFail} = {}) => ([
  authenticate.onFail(onFail),
  assignParamsToBody,
  (req, res, next) => {
    let body = bodyOrQuery(req)
    let {user} = req
    let validators = []
    if (isString(actions)) {
      actions = [actions]
    }
    if (actions.length === 0) {
      authenticate.sendNotAuthorized(req, res)
      throw new Error('Please provide actions')
    }
    actions.forEach(action => {
      let _validators = permissions[action]
      if (_validators && _validators.length > 0) {
        validators = validators.concat(_validators)
      } else {
        authenticate.sendNotAuthorized(req, res)
        throw new Error(`There is no validators for action '${action}'`)
      }
    })

    Promise.all(validators.map(validator => (validator(body, user))))
      .then(() => next())
      .catch(err => {
        console.log(`Validator error: ${err && err.message}`)
        if (isFunction(onFail)) {
          onFail(req, res, next)
        } else {
          authenticate.sendNotAuthorized(req, res)
        }
      })
  }
])

authenticate.is = type => [
  authenticate,
  (req, res, next) => {
    let {user} = req
    if (type && type.length > 0 && user.type === type) {
      next()
    } else {
      authenticate.sendNotAuthorized(req, res)
    }
  }
]

const prepareUserData = (user = {}) => {
  let {_id, avatarImage, firstname, surname, username, birthDate, isContentManager, location, contego} = user

  return {
    _id,
    avatarImage,
    firstname,
    surname,
    username,
    birthDate,
    isContentManager,
    location,
    verificationSubmitted: !!contego.reference
  }
}

const generateToken = user => {
  if (!user.verification) {
    // Create token if the password matched and no error was thrown
    let token = jwt.sign({user: user.id}, process.env.PASSPORT_SECRET, {
      expiresIn: '5 days'
    })
    return Promise.resolve({
      token,
      user: prepareUserData(user)
    })
  } else {
    return Promise.reject({status: NOT_VERIFIED, message: VERIFICATION.ERROR})
  }
}

const getResetPasswordToken = user => {
  let token = jwt.sign({user: user.id}, process.env.RESETPASSWORD_SECRET, {
    expiresIn: '1 days'
  })
  return token
}
module.exports = {
  generateToken,
  prepareUserData,
  authenticate,
  getResetPasswordToken
}
