const UserModel = require('api/user/model')
const Syndicate = require('api/syndicate/model')
module.exports = (body) => {
  let syndicateName = body.name

  return Syndicate.findOne({name: syndicateName}).then(_syndicate => {
    if (!_syndicate) {
      return Promise.reject({message: 'incorrect syndicate name'})
    }
    return UserModel.find({}, {__v: false, password: false}).lean().then(_users => {
      let members = _users.filter(_u => {
        return _u.syndicates.filter(_s => {
          return _s._id.toString() === _syndicate._id.toString() && _s.role !== 'pending'
        }).length > 0
      })

      return Promise.resolve(members)
    })
  }).catch(_err => {
    console.log(_err)
    return Promise.reject(_err)
  })
}
