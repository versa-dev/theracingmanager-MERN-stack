const UserController = require('api/user/controller')
const Syndicate = require('api/syndicate/model')

module.exports = body => {
  let syndicateName = body.name
  let shareDistribution = body.shareDistribution
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
          let hasOwn = false
          let syndicates = _user.syndicates
          syndicates.forEach(s => {
            if (s._id.toString() === _syndicate._id.toString()) {
              hasOwn = true
            }
          })

          if (!hasOwn) {
            syndicates.push({_id: _syndicate._id, owned: shareDistribution})
            Promise.reject({message: 'user is not owner of the syndicate'})
          } else {
            // return Promise.reject({message: 'user is already owner of syndicate'})
            syndicates.forEach(s => {
              if (s._id.toString() === _syndicate._id.toString()) {
                s.owned = shareDistribution
              }
            })
          }

          _user.syndicates = syndicates
          return _user.save()
        }
      }).then(_result => {
        return Promise.resolve()
      })
    } else {
      Promise.reject({message: 'userId is required'})
    }
  })
}
