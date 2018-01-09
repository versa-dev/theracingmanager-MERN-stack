const {hyphenize} = require('utils/transforms')
const {prepareHorse} = require('api/horse/utils')
const SyndicateModel = require('api/syndicate/model')
module.exports = (ownership) => {
  let result = []
  let syndicates = {}
  let promises = []

  ownership.forEach(elem => {
    let synd = SyndicateModel.findOne({_id: elem.horse.syndicate._id})
    promises.push(synd)
  })
  return Promise.all(promises).then(_syndicates => {
    ownership.forEach(elem => {
      let syndicateForHorse = _syndicates.filter(s => {
        return elem.horse.syndicate._id.toString() === s._id.toString()
      })[0]
      elem.horse.syndicate.name = syndicateForHorse.name
      elem.horse.syndicate.color = syndicateForHorse.color

      let syndicateName = elem.horse.syndicate.name
      if (!syndicates[syndicateName]) {
        syndicates[syndicateName] = {
          horses: []
        }
      }
      let newHorse = prepareHorse(elem.horse)
      newHorse.shares = elem.shares
      syndicates[syndicateName].color = elem.horse.syndicate.color
      syndicates[syndicateName].horses.push(
        newHorse
      )
    })

    Object.keys(syndicates).forEach(key => {
      let value = syndicates[key]
      result.push({
        name: key,
        slug: hyphenize(key),
        color: value.color,
        horses: value.horses
      })
    })
    return Promise.resolve(result)
  })
}
