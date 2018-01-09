require('../../setup')
require('./sms')()
  .then(() => {
    console.log('success')
    process.exit(0)
  }).catch(err => {
    console.log(err)
    process.exit(1)
  })
