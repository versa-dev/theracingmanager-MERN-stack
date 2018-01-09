const {sendApn} = require('utils/apns')

module.exports = () => {
  let deviceToken = '5b24ba3e3c77902b2e61153023bef34b490b9a84c151a6ccd7c7a84f080afb68'
  let message = 'Welcome to TRM'
  let payload = {
    horseName: 'TOBE'
  }

  return sendApn(deviceToken, message, payload).then(_res => {
    console.log(_res)
    return Promise.resolve()
  }).catch(_err => {
    console.log(_err)
    return Promise.reject(_err)
  })
}
