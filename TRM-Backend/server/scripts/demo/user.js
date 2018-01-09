const HorseController = require('api/horse/controller')
const SyndicateController = require('api/syndicate/controller')
const UserController = require('api/user/controller')

module.exports = {
  register: () => {
    let ownership = []
    return HorseController.find(
      {}
    ).then(horses => {
      horses.forEach(horse => {
        ownership.push({
          horse: horse._id,
          shares: parseInt(Math.floor(Math.random() * 100) + 1)
        })
      })

      return SyndicateController.findOne({name: 'HIGHCLERE'})
    }).then(syndicate => {
      let user = {
        firstname: 'John',
        surname: 'Doe',
        password: 'Demo12',
        email: 'demo@vitaminlondon.com',
        type: 'admin',
        deviceType: 'ios',
        deviceToken: '6df979e55f870befae79814a85110f2b643c993f807d140840aae9ed735ee652',
        phoneNumber: '+447791902408',
        notifyOptions: {
          email: true,
          text: true,
          apple: true
        },
        syndicates: [{
          _id: syndicate._id,
          role: 'manager'
        }],
        ownership
      }
      if (global.isLocal) {
        user._id = '59ba8724882f8bda956d968e'
      }
      return UserController.updateOrCreate({
        query: {firstname: user.firstname},
        data: user
      })
    })
  },

  get: () => {
    return UserController.findOne(
      {name: 'demo'}
    ).populate('ownership.horse')
  }
}
