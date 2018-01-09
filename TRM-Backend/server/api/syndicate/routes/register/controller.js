const Syndicate = require('api/syndicate/model')
const UserController = require('api/user/controller')
const SyndicateController = require('api/syndicate/controller')
const HorseController = require('api/horse/controller')
const {getHorsesByIds} = require('api/horse/utils')
const convert = require('scripts/timeform/convertFields')
const {hyphenize} = require('utils/transforms')

const registerName = (body, {user}) => {
  let {name} = body

  return Syndicate.findOne(
    {name: name.toUpperCase()}
  ).then(syndicate => {
    if (syndicate) {
      return Promise.reject({message: 'syndicate already exist'})
    } else {
      return Syndicate.create({
        owner: {
          firstname: user.firstname,
          surname: user.surname,
          email: user.email
        },
        name: name.toUpperCase(),
        approved: 0
      }).then(_syndicate => {
        let syndicate = {}
        syndicate = _syndicate.toObject()
        syndicate.slug = hyphenize(name)
        return UserController.findOne({_id: user._id}).then(_user => {
          let newSyndicate = {_id: _syndicate._id, owned: Math.floor(Math.random() * 100)}
          _user.syndicates.push(newSyndicate)
          return _user.save().then(result => {
            return Promise.resolve(syndicate)
          })
        })
      })
    }
  })
}

const updateName = (body, {user}) => {
  let data = {name: body.newName}
  return SyndicateController.updateOne({
    query: {
      name: body.name
    },
    data
  })
    .then(() => (Promise.resolve()))
}

const registerHorses = (body, {user}) => {
  let syndicateName = body.name
  let horses = body.horses
  let syndicate = {}

  return SyndicateController.findOne({name: syndicateName}).then(_syndicate => {
    if (!_syndicate) {
      Promise.reject({message: 'syndicate does not exist'})
    } else {
      syndicate._id = _syndicate._id
      let horseIds = horses.map(h => { return h.horseCode })
      return getHorsesByIds(horseIds)
    }
  }).then(_timeformHorses => {
    let detailHorses = []
    _timeformHorses.forEach(_th => {
      let horse = horses.filter(h => {
        return h.horseCode === _th[0].horseCode
      })[0]
      delete horse.horseCode
      horse.syndicate = syndicate

      let detailHorse = {}
      let horseData = convert.horse(_th[0])
      detailHorse = Object.assign(horseData, horse)
      detailHorses.push(detailHorse)
    })

    let promises = []
    detailHorses.forEach(_h => {
      let timeformId = _h.timeformId
      let createOneHorse = HorseController.updateOrCreate({
        query: {timeformId},
        data: _h
      })
      promises.push(createOneHorse)
    })
    return Promise.all(promises)
  }).then(_result => {
    return Promise.resolve()
  })
}

const updateColor = (body, {user}) => {
  let name = body.name
  let mainColor = body
  let data = {mainColor}
  return SyndicateController.updateOne({
    query: {
      name: name
    },
    data
  })
    .then(() => (Promise.resolve()))
}

const registerOwners = (body, {user}) => {
  let syndicateName = body.name
  let owners = body.owners
  let promises = []

  return SyndicateController.findOne({name: syndicateName}).then(_syndicate => {
    if (!_syndicate) {
      Promise.reject({message: 'syndicate does not exist'})
    } else {
      let syndicates = []
      syndicates.push({_id: _syndicate._id})
      owners.forEach(_owner => {
        _owner.type = 'owner'
        _owner.syndicates = syndicates
        let createOwner = UserController.create(_owner)
        promises.push(createOwner)
      })
      return Promise.all(promises)
    }
  }).then(_result => {
    return Promise.resolve(_result)
  })
}

const updateOwners = (body, {user}) => {
  let syndicateName = body.name
  let owners = body.owners
  let promises = []

  return SyndicateController.findOne({name: syndicateName}).then(_syndicate => {
    if (!_syndicate) {
      Promise.reject({message: 'syndicate does not exist'})
    } else {
      let syndicates = []
      syndicates.push({_id: _syndicate._id})
      owners.forEach(_owner => {
        let query
        if (_owner._id === undefined) { // new owner
          _owner.type = 'owner'
          _owner.syndicates = syndicates
          query = {}
        } else {
          query = {id: _owner._id}
        }
        let createOwner = UserController.updateOrCreate({query: query, data: _owner})
        promises.push(createOwner)
      })
      return Promise.all(promises)
    }
  }).then(_result => {
    return Promise.resolve(_result)
  })
}

const updateShares = (body, {user}) => {
  let syndicateName = body.name
  let owners = body.owners
  let syndicate

  return SyndicateController.findOne({name: syndicateName}).then(_syndicate => {
    let promises = []
    if (!_syndicate) {
      Promise.reject({message: 'syndicate does not exist'})
    } else {
      syndicate = _syndicate
      owners.forEach(_owner => {
        if (_owner._id === undefined) { // new owner
          return Promise.reject({message: 'wrong owner identifier'})
        } else {
          let findUser = UserController.findOne({_id: _owner._id}).select('syndicates')
          promises.push(findUser)
        }
      })
      return Promise.all(promises)
    }
  }).then(_users => {
    let promises = []
    owners.forEach(_owner => {
      let syndicates = _users.filter(_u => {
        return _owner._id === _u._id.toString()
      })[0].syndicates

      let hasOwn = false
      syndicates.forEach(s => {
        if (s._id.toString() === syndicate._id.toString()) {
          s.owned = _owner.owned
          hasOwn = true
        }
      })

      if (!hasOwn) {
        syndicates.push({_id: syndicate._id, owned: _owner.owned})
      }
      _owner.syndicates = syndicates

      let updateShares = UserController.updateOne({query: {_id: _owner._id}, data: {syndicates: _owner.syndicates}})
      promises.push(updateShares)
    })
    return Promise.all(promises)
  }).then(_result => {
    return Promise.resolve(_result)
  })
}

const registerTeam = (body, {user}) => {
  let syndicateName = body.name
  let owners = body.owners
  let syndicate

  return SyndicateController.findOne({name: syndicateName}).then(_syndicate => {
    if (!_syndicate) {
      Promise.reject({message: 'syndicate does not exist'})
    } else {
      syndicate = _syndicate
      let promises = []
      owners.forEach(_owner => {
        let syndicates = []
        if (_owner._id === undefined) { // new owner
          _owner.type = 'owner'
          syndicates.push({_id: syndicate._id, owned: _owner.owned})
          _owner.syndicates = syndicates

          let createOwner = UserController.create(_owner)
          promises.push(createOwner)
        }
      })
      return Promise.all(promises)
    }
  }).then(_result => {
    let promises = []
    owners.forEach(_owner => {
      if (_owner._id !== undefined) { // existing owner
        let findUser = UserController.findOne({_id: _owner._id}).select('syndicates')
        promises.push(findUser)
      }
    })
    return Promise.all(promises)
  }).then(_users => {
    let promises = []
    owners = owners.filter(_owner => {
      return _owner._id !== undefined
    })
    owners.forEach(_owner => {
      let syndicates = _users.filter(_u => {
        return _owner._id === _u._id.toString()
      })[0].syndicates

      let hasOwn = false
      syndicates.forEach(s => {
        if (s._id.toString() === syndicate._id.toString()) {
          s.owned = _owner.owned
          hasOwn = true
        }
      })

      if (!hasOwn) {
        syndicates.push({_id: syndicate._id, owned: _owner.owned})
      }
      _owner.syndicates = syndicates

      let updateOwner = UserController.updateOne({query: {_id: _owner._id}, data: _owner})
      promises.push(updateOwner)
    })

    return Promise.all(promises)
  }).then(_result => {
    return Promise.resolve()
  })
}

module.exports = {
  registerName,
  updateName,
  registerHorses,
  updateColor,
  registerOwners,
  updateOwners,
  updateShares,
  registerTeam
}
