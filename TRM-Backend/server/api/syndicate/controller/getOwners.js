const UserController = require('api/user/controller')
const Syndicate = require('api/syndicate/model')
module.exports = (body) => {
  let syndicateName = body.name

  return Syndicate.findOne({name: syndicateName}).then(_syndicate => {
    if (!_syndicate) {
      return Promise.reject({message: 'incorrect syndicate name'})
    }
    return UserController.find().then(_users => {
      let owners = _users.filter(_u => {
        let hasSyndicate = _u.syndicates.filter(_s => {
          return _s._id.toString() === _syndicate._id.toString()
        }).length > 0
        return (_u.type === 'owner' || _u.type === 'manager' || _u.type === 'admin') && hasSyndicate
      })

      return Promise.resolve(owners)
    })
  })
}
