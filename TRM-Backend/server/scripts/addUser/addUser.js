const UserController = require('api/user/controller')
module.exports = () => {
  const args = require('minimist')(process.argv.slice(2))
  let role = args.r
  let user = {}
  switch (role) {
    case 'manager':
      console.log('creating manager user')
      user = {
        firstname: 'Jake',
        surname: 'Benjamin',
        password: 'Demo12',
        email: 'manager@vitaminlondon.com',
        type: 'manager'
      }

      break

    default:
      break
  }

  return UserController.updateOrCreate({
    query: {firstname: user.firstname},
    data: user
  })
}
