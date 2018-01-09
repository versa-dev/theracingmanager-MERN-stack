const User = require('api/user/model')
const {sendMail} = require('utils/email')
const randomString = require('randomstring')
const {REGISTER} = require('data/messages')
const {randomInteger} = require('utils/math')
const HorseController = require('api/horse/controller')
const {removeEmpty, safeTrim} = require('utils/object')
const {joinRequest} = require('api/user/routes/join-request/controller')
const request = require('request-promise')

const sendUserToDynamics = ({firstname, surname} = {}) => {
  // if (!global.isUat && !global.isDev) return Promise.resolve()

  let tokenExchangeUrl = `https://login.windows.net/${process.env.DYNAMICS_TENANT}/oauth2/token`
  let refreshToken = process.env.DYNAMICS_REFRESH_TOKEN
  let clientId = process.env.DYNAMICS_CLIENT_ID
  let dynamicsClientUrl = 'https://theracingmanager.crm11.dynamics.com'

  let payload = {
    resource: dynamicsClientUrl,
    client_id: clientId,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    redirect_uri: 'http://all.local/trm-dyn2/index.php'
  }

  let options = {
    method: 'POST',
    uri: tokenExchangeUrl,
    form: payload
  }

  return request(options).then(res => {
    let {access_token} = JSON.parse(res)
    let dynamicsApiUrl = 'https://theracingmanager.crm11.dynamics.com/api/data/v8.2/'
    let payload = {
      firstname,
      lastname: surname,
      yomifullname: `${firstname} ${surname}`
    }

    let options = {
      method: 'POST',
      uri: dynamicsApiUrl + 'leads',
      body: JSON.stringify(payload),
      resolveWithFullResponse: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // eslint-disable-next-line camelcase
        'Authorization': `Bearer ${access_token}`
      }
    }

    return request(options).then(res => {
      let id = res.headers['odata-entityid'].match(/\([a-z0-9_-]+?\)$/i)[0].substring(1)
      return id.substring(0, id.length - 1)
    })
  })
}// f

const createUser = body => {
  const {username, email, password, firstname, surname, joinHorse, joinSyndicate} = body
  const verification = randomString.generate(80)

  let user = new User(removeEmpty({
    username: safeTrim(username),
    email: safeTrim(email),
    password: safeTrim(password),
    firstname: safeTrim(firstname),
    surname: safeTrim(surname),
    dynHandle: 'placeholder',
    verification,
    type: 'member'
  }))

  return user.validate()
    .then(() => {
      return sendUserToDynamics({
        firstname,
        surname
      })
    })
    .then(dynId => {
      user.dynHandle = dynId
      return user.save()
    })
    .then(_user => {
      user = _user
      if (joinHorse || joinSyndicate) {
        return joinRequest({
          horseName: joinHorse,
          syndicateName: joinSyndicate
        }, {
          user
        })
      } else return Promise.resolve()
    })
    .then(() => {
      if (global.isDev) {
        return HorseController.getRandomHorse({amount: randomInteger(6, 10)})
      } else {
        return HorseController.find({
          name: {
            $in: [
              'CONTENTMENT',
              'HAVRE DE PAIX (FR)',
              'HANSEATIC',
              'ELATION (IRE)'
            ]
          }
        })
      }
    })
    .then(horses => {
      if (horses) {
        let ownership = []
        horses.forEach(horse => {
          ownership.push({
            horse: horse._id,
            shares: parseInt(Math.random() * 15) + 15
          })
        })
        user.ownership = ownership
        return user.save()
      } else {
        return Promise.resolve()
      }
    })
    .then(() => {
      return Promise.resolve(verification)
    })
}

const registerUser = body => {
  const {email, firstname} = body

  return createUser(body).then(verification => {
    let baseUrl
    switch (global.nodeEnv) {
      case 'dev':
        baseUrl = '52.51.111.248:3000'
        break
      case 'uat':
        baseUrl = 'uat.theracingmanager.com'
        break
      default:
        baseUrl = 'localhost:8080'
    }
    let verificationUrl = `http://${baseUrl}/user/verify/${verification}`

    let mailData = {
      to: email,
      subject: `The Racing Manager email verification`,
      template: {
        name: 'verification',
        data: {
          firstname,
          url: verificationUrl
        }
      }
    }
    sendMail(mailData)

    return Promise.resolve({message: REGISTER.SUCCESS})
  })
}

module.exports = {
  createUser,
  registerUser
}
