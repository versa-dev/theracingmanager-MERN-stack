const {horses} = require('scripts/timeform/api')
const Syndicate = require('api/syndicate/model')
const {HorseModel} = require('api/horse/model')
const convert = require('scripts/timeform/convertFields')
const {hyphenize} = require('utils/transforms')

module.exports = (body, {user}) => {
  let {name, horseTimeformID, horseName} = body
  let syndicate = {}
  let query

  if (horseTimeformID === undefined && horseName === undefined) {
    return Promise.reject({message: 'invalid paramaters'})
  }
  if (horseTimeformID === undefined) {
    query = `horseName eq '${horseName.toUpperCase()}'`
  } else {
    query = `horseCode eq '${horseTimeformID}'`
  }

  return Syndicate.findOne({name: name}).then(_syndicate => {
    if (!_syndicate) {
      return Promise.reject({message: 'syndicate does not exist'})
    } else {
      syndicate._id = _syndicate._id
      return horses.get({
        $filter: query
      })
    }
  }).then(_timeformHorse => {
    if (_timeformHorse.length === 0) {
      return Promise.reject({message: 'no horse'})
    }

    let horse = _timeformHorse[0]
    horse.syndicate = syndicate

    let detailHorse = {}
    let horseData = convert.horse(_timeformHorse[0])
    detailHorse = Object.assign(horseData, horse)
    detailHorse.ownershipType = 'Owned'
    return HorseModel.create(detailHorse)
  }).then(_horse => {
    let horse = _horse.toObject()
    horse.slug = hyphenize(horse.name)
    return Promise.resolve(horse)
  }).catch(_err => {
    console.log(_err)
    return Promise.reject(_err)
  })
}
