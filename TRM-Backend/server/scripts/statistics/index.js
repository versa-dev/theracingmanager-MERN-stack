require('../../setup')
require('./statistic')()
  .then(() => {
    process.exit(0)
  })
  .catch(err => {
    throw err
  })
