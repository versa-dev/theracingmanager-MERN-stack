const {horses} = require('scripts/timeform/api')

const getHorsesByIds = (body) => {
  let horseIds = body
  let promises = []
  horseIds.forEach(_horseId => {
    let horse = horses.get({
      $filter: `horseCode eq '${_horseId}'`
    })
    promises.push(horse)
  })
  return Promise.all(promises)
}

module.exports = getHorsesByIds
