const UserController = require('api/user/controller')
const Syndicate = require('api/syndicate/model')

module.exports = body => {
  let syndicateName = body.name
  return Syndicate.findOne({name: syndicateName}).then(_syndicate => {
    if (!_syndicate) {
      return Promise.reject({message: 'syndicate does not exist'})
    }
    if (body.userId !== undefined) {
      let userId = body.userId
      return UserController.findOne({_id: userId}).then(_user => {
        if (!_user) {
          return Promise.reject({message: 'user does not exist'})
        } else {
          if (_user.syndicates.filter(_s => {
            return _s._id.toString() === _syndicate._id.toString()
          }).length === 0) {
            return Promise.reject({message: 'user is not syndicate member'})
          }
          let syndicates = _user.syndicates

          syndicates = syndicates.filter(s => {
            return s._id.toString() !== _syndicate._id.toString()
          })

          _user.syndicates = syndicates
          return _user.save()
        }
      }).then(_result => {
        return Promise.resolve()
      })
    } else {
      Promise.reject({message: 'userId is required'})
    }
  }).catch(_err => {
    console.log(_err)
    return Promise.reject(_err)
  })
}
