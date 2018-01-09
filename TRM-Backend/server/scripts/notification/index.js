require('../../setup')
require('./notification')()
  .then(() => {
    console.log('success')
  }).catch(err => {
    console.log(err)
    process.exit(1)
  })
