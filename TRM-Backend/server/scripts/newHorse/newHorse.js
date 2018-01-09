const {authenticate, horses, performances} = require('../timeform/api')
const {randomInteger} = require('utils/math')
const SyndicateModel = require('api/syndicate/model')
const convert = require('scripts/timeform/convertFields')
const HorseController = require('api/horse/controller')
const {HorseModel} = require('api/horse/model')

module.exports = () => {
  const args = require('minimist')(process.argv.slice(3))
  let horseName = args.s
  let syndicateName = args._[0]
  return authenticate.then(() => {
    if (horseName === undefined || syndicateName === undefined) {
      return Promise.reject({message: 'invalid parameters'})
    }
    return HorseModel.findOne({name: horseName}).then(_horse => {
      if (_horse) {
        return Promise.reject({message: 'horse already exists in DB'})
      } else {
        return new Promise((resolve, reject) => {
          horses.get({
            $filter: `horseName eq '${horseName}'`
          }).then(_timeFormHorse => {
            if (_timeFormHorse.length === 0) {
              return reject({message: 'horse does not exist in timeForm'})
            } else {
              let horse = _timeFormHorse[0]
              let horseData = convert.horse(horse)
              horseData.name = horseData.name.toUpperCase()
              horseData.racingType = 'National Hunt'
              horseData.ownership = {
                type: 'Fixed Period'
              }
              horseData.ownershipType = 'Owned'
              horseData.cost = {
                monthly: randomInteger(500, 1500) * 5,
                initial: randomInteger(2100, 4500) * 5
              }
              horseData.style = 'Jump'
              return performances.get({
                $filter: `horseCode eq '${horse.horseCode}'`
              }).then(performances => {
                let performancesData = []
                performances.forEach(performance => {
                  performancesData.push(convert.performance(performance))
                })
                horseData.performances = performancesData
                return SyndicateModel.findOne({name: syndicateName})
              }).then(_syndicate => {
                horseData.syndicate = _syndicate
                let timeFormId = horse.horseCode.trim()
                return HorseController.updateOrCreate({
                  query: {timeFormId},
                  data: horseData
                })
              }).then(_result => {
                HorseModel.SyncToAlgolia(
                ).then(() => {
                  process.exit(0)
                }).catch(err => {
                  console.log(err.message)
                })
                return Promise.resolve(_result)
              }).catch(_err => {
                console.log(_err)
                return Promise.reject(_err)
              })
            }
          })
        })
      }
    })
  })
}
