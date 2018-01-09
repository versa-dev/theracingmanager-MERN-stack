const User = require('api/user/model')
const {generateToken} = require('utils/authentication')
const request = require('request-promise')

const markUserAsVerifiedInDynamics = (user) => {
  let dynHandle = user.dynHandle
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
    let payload = { jobtitle: 'verified' }

    let options = {
      method: 'PATCH',
      uri: `${dynamicsApiUrl}leads(${dynHandle})`,
      body: JSON.stringify(payload),
      resolveWithFullResponse: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // eslint-disable-next-line camelcase
        'Authorization': `Bearer ${access_token}`
      }
    }

    return request(options).then(() => {
      return user
    })
  })
}// f

const verifyUser = (body) => {
  if (!body.token) return Promise.reject()

  return User.findOneAndUpdate({
    verification: body.token
  }, {
    $unset: {
      verification: 1
    }
  }, {
    new: true
  }).then(user => {
    return markUserAsVerifiedInDynamics(user)
  }).then(user => {
    if (user) {
      return generateToken(user)
    } else {
      return Promise.reject()
    }
  }).catch(e => {
    console.log(e)
  })
}

module.exports = {
  verifyUser
}
