const {authenticate, horses} = require('../timeform/api')
const {HorseModel} = require('api/horse/model')

const updateOrCreateHorse = require('../timeform/updateOrCreateHorse')

module.exports = () => {
  return authenticate.then(() => {
    HorseModel.find({}, 'name')
      .then(horseName => {
        return Promise.all(horseName.map((horse, i) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              horses.get({
                $filter: `horseName eq '${horse.name}'`
              })
                .then(horse => resolve(horse))
                .catch(err => reject(err))
            }, 1000 * i)
          })
        }))
      }).then(horses => {
        return Promise.all(horses.map(horse => {
          return updateOrCreateHorse(horse[0])
        }))
      }).then(() => {
        console.log('Updated timeform data!')
      }).catch(err => {
        console.error(err.message)
        process.exit(err.code)
      })
  }).catch(err => {
    console.error(err.message)
    process.exit(err.code)
  })
}
