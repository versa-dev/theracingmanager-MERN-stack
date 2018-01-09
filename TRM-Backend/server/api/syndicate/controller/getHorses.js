const {HorseModel} = require('api/horse/model')
const Syndicate = require('api/syndicate/model')
const {hyphenize} = require('utils/transforms')

module.exports = (body) => {
  let syndicateName = body.name

  return Syndicate.findOne({name: syndicateName}).then(_syndicate => {
    if (!_syndicate) {
      return Promise.reject({message: 'incorrect syndicate name'})
    }
    return HorseModel.find({}, {__v: false, timeformId: false}).lean().then(_horses => {
      let horses = _horses.filter(_h => {
        return _h.syndicate._id.toString() === _syndicate._id.toString()
      })

      horses.forEach(_h => {
        _h.slug = hyphenize(_h.name)
      })
      return Promise.resolve(horses)
    })
  }).catch(_err => {
    console.log(_err)
    return Promise.reject(_err)
  })
}
