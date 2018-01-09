const {HorseModel} = require('api/horse/model')

module.exports = (body, {user}) => {
  if (user.isContentManager) { // return all horses
    return HorseModel.find(
      {},
      {__v: 0, timeformId: 0}
    ).lean().then(_horses => {
      return Promise.resolve(_horses)
    })
  } else { // return only own horses
    let promises = []
    let ownHorseIds = user.ownership
    if (!ownHorseIds) {
      return Promise.reject('no horses')
    } else {
      ownHorseIds.forEach(_ownHorse => {
        promises.push(HorseModel.findOne({_id: _ownHorse.horse.toString()}, {__v: 0, timeformId: 0}).lean())
      })
      return Promise.all(promises).then(_horses => {
        return Promise.resolve(_horses)
      })
    }
  }
}
