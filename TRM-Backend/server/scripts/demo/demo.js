const userUtils = require('./user')

userUtils.register().then(() => {
  console.log('USER REGISTERED!')
  process.exit(0)
}).catch(err => {
  console.error(err.message)
  process.exit(err.code)
})
