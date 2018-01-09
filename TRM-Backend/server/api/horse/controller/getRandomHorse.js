const {HorseModel} = require('api/horse/model')
const SyndicateModel = require('api/syndicate/model')
const {prepareHorse} = require('api/horse/utils')

module.exports = (body = {}) => {
  let {amount} = body
  let horses = []

  return HorseModel.aggregate(
    {$sample: {size: amount || 9}}
  ).then(_horses => {
    horses = _horses
    let promises = []
    _horses.forEach(h => {
      promises.push(SyndicateModel.findOne({_id: h.syndicate._id}))
    })
    return Promise.all(promises)
  }).then(_syndicates => {
    horses.forEach(_horse => {
      let syndicate = _syndicates.filter(s => {
        return s._id.toString() === _horse.syndicate._id.toString()
      })[0]
      _horse.syndicate.name = syndicate.name
      _horse.syndicate.color = syndicate.color
    })
    if (horses) {
      let horseData = []
      horses.forEach(horse => {
        horseData.push(prepareHorse(horse))
      })
      return Promise.resolve(horseData)
    } else {
      return Promise.reject({message: 'Not found'})
    }
  })
}
