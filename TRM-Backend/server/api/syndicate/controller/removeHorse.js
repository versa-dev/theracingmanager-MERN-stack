const UserController = require('api/user/controller')
const Syndicate = require('api/syndicate/model')
const {HorseModel} = require('api/horse/model')

module.exports = body => {
  let syndicateName = body.name
  let horseId = body.horseId
  if (horseId === undefined) {
    return Promise.reject({message: 'horseId is missing'})
  }
  return Syndicate.findOne({name: syndicateName}).then(_syndicate => {
    if (!_syndicate) {
      return Promise.reject({message: 'syndicate does not exist'})
    }
    return HorseModel.findOne({_id: horseId}).then(_horse => {
      if (!_horse) {
        return Promise.reject({message: 'invalid horseId'})
      }
      if (_horse.syndicate._id.toString() !== _syndicate._id.toString()) {
        return Promise.reject({message: 'horse does not belongs to syndicate'})
      }
      return UserController.find()
    })
  }).then(_users => { // remove horse from user's ownership
    let promises = []
    _users.forEach(_user => {
      if (_user.ownership.filter(_h => {
        return _h.horse.toString() === horseId
      }).length > 0) {
        let ownership = _user.ownership.filter(_h => {
          return _h.horse.toString() !== horseId
        })
        _user.ownership = ownership
        promises.push(_user.save())
      }
    })
    return Promise.all(promises)
  }).then(_result => {
    return HorseModel.deleteOne({_id: horseId})
  }).then(_result => {
    return Promise.resolve()
  }).catch(_err => {
    console.log(_err)
    return Promise.reject(_err)
  })
}
