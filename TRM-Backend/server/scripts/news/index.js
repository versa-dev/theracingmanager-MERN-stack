/**
 * Created by Ali on 15/09/2017.
 */
require('../../setup')
require('./news')()
  .then(() => {
    process.exit(0)
  })
  .catch(err => {
    throw err
  })
