require('../../setup')
require('./gcm')()
  .then(() => {
    console.log('success')
    process.exit(0)
  }).catch(err => {
    console.log(err)
    process.exit(1)
  })
