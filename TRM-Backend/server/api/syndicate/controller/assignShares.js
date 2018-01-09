const UserController = require('api/user/controller')
const Syndicate = require('api/syndicate/model')
const {HorseModel} = require('api/horse/model')

module.exports = (body, {user}) => {
  let syndicateName = body.name
  let horses = body.horses
  let syndicate
  return Syndicate.findOne({name: syndicateName}).then(_syndicate => {
    if (!_syndicate) {
      return Promise.reject({message: 'syndicate does not exist'})
    }
    syndicate = _syndicate
    let promises = []
    horses.forEach(_horse => {
      _horse.name = _horse.name.toUpperCase()
      promises.push(HorseModel.findOne({name: _horse.name}))
    })
    return Promise.all(promises)
  }).then(_horses => {
    if (_horses.indexOf(null) > -1) {
      return Promise.reject({message: 'invalid horses'})
    }
    // validate horses belongs the syndicate
    let isValidHorses = false
    for (let _horse of _horses) {
      if (_horse.syndicate._id.toString() !== syndicate._id.toString()) {
        isValidHorses = false
        break
      }
      isValidHorses = true
    }

    if (!isValidHorses) {
      return Promise.reject({message: 'invalid syndicate horses'})
    }

    horses.forEach(_horse => {
      _horse._id = _horses.filter(_h => {
        return _h.name === _horse.name
      })[0]._id
    })

    let promises = []
    let usersIds = []
    horses.forEach(_horse => {
      _horse.users.forEach(_user => {
        if (usersIds.indexOf(_user._id) < 0) {
          usersIds.push(_user._id)
        }
      })
    })

    usersIds.forEach(_userId => {
      promises.push(UserController.findOne({_id: _userId}))
    })
    return Promise.all(promises)
  }).then(_users => {
    if (_users.indexOf(null) > -1) {
      return Promise.reject({message: 'invalid users'})
    }

    let isValidMembers = false
    for (let _user of _users) {
      if (_user.syndicates.filter(_syndicate => {
        return _syndicate._id.toString() === syndicate._id.toString()
      }).length === 0) {
        isValidMembers = false
        break
      }
      isValidMembers = true
    }

    if (!isValidMembers) {
      return Promise.reject({message: 'invalied syndicate members'})
    }

    let promises = []
    _users.forEach(_user => {
      let ownership = []
      horses.forEach(_horse => {
        let userDistributed = _horse.users.filter(_u => {
          return _u._id.toString() === _user._id.toString()
        })
        if (userDistributed.length > 0) {
          let owned = userDistributed[0].owned
          if (_user.ownership.filter(_h => {
            return _h.horse.toString() === _horse._id.toString()
          }).length > 0) { // horse is already exist in ownership
            ownership = _user.ownership.map(_h => {
              if (_h.horse.toString() === _horse._id.toString()) {
                _h.shares = owned
              }
              return _h
            })
          } else { // build new ownership
            ownership = _user.ownership
            ownership.push({horse: _horse._id, shares: owned})
          }
        }
      })
      ownership = ownership.filter(_o => {
        return _o.shares > 0
      })
      _user.ownership = ownership
      promises.push(_user.save())
    })
    return Promise.all(promises)
  }).then(_result => {
    return Promise.resolve()
  }).catch(_err => {
    console.log(_err)
    return Promise.reject(_err)
  })
}
