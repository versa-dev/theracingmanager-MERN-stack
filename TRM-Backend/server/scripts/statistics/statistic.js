const {HorseModel} = require('api/horse/model')
const {HorsePerformanceModel, HorseRaceModel, HorseEntryModel} = require('api/horse/model')
const {authenticate, races, performances, entries} = require('../timeform/api')

module.exports = () => {
  return Promise.all([
    HorseEntryModel.remove(),
    HorseRaceModel.remove(),
    HorsePerformanceModel.remove()
  ]).then(() => {
    console.log('flushed')
    let performanceData = []
    let horseCodes = []
    return authenticate.then(() => {
      return HorseModel.find({})
    }).then(_horses => {
      return Promise.all(_horses.map((curHorse, i) => {
        horseCodes.push(curHorse.timeformId)
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            performances.get({
              $filter: `horseCode eq '${curHorse.timeformId}'`
            })
              .then(performance => resolve(performance))
              .catch(err => reject(err))
          }, 1000 * i)
        })
      }))
    }).then(data => {
      return Promise.all([].concat.apply([], data).map(_performance => {
        return new Promise((resolve, reject) => {
          performanceData.push({
            raceNumber: _performance.raceNumber,
            meetingDate: _performance.meetingDate,
            courseId: _performance.courseId
          })
          HorsePerformanceModel.find({
            raceNumber: `${_performance.raceNumber}`,
            meetingDate: `${_performance.meetingDate}`,
            courseId: `${_performance.courseId}`
          }).exec().then(data => {
            if (data.length > 0) {
              resolve(HorsePerformanceModel.update(_performance))
            } else {
              resolve(HorsePerformanceModel.create(_performance))
            }
          }).catch(err => {
            reject(err)
          })
        })
      }))
    }).then(() => {
      return Promise.all(horseCodes.map((horseCode, i) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            entries.get({
              $filter: `horseCode eq '${horseCode}'`
            })
              .then(entry => resolve(entry))
              .catch(err => reject(err))
          }, 1000 * i)
        })
      }))
    }).then(data => {
      return Promise.all([].concat.apply([], data).map(_entry => {
        return new Promise((resolve, reject) => {
          HorseEntryModel.find({
            courseName: `${_entry.courseName}`,
            meetingDate: `${_entry.meetingDate}`,
            horseName: `${_entry.horseName}`
          }).exec().then(data => {
            if (data.length > 0) {
              resolve(HorseEntryModel.update(_entry))
            } else {
              resolve(HorseEntryModel.create(_entry))
            }
          }).catch(err => {
            reject(err)
          })
        })
      }))
    }).then(() => {
      return Promise.all(performanceData.map((curRace, i) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            races.get({
              $filter: `raceNumber eq ${curRace.raceNumber} and courseId eq ${curRace.courseId} and meetingDate eq DateTime'${curRace.meetingDate}'`
            })
              .then(races => resolve(races))
              .catch(err => reject(err))
          }, 1000 * i)
        })
      }))
    }).then(data => {
      return Promise.all([].concat.apply([], data).map(_race => {
        return new Promise((resolve, reject) => {
          HorseRaceModel.find({
            raceNumber: `${_race.raceNumber}`,
            meetingDate: `${_race.meetingDate}`,
            courseId: `${_race.courseId}`
          }).exec().then(data => {
            if (data.length > 0) {
              resolve(HorseRaceModel.update(_race))
            } else {
              resolve(HorseRaceModel.create(_race))
            }
          }).catch(err => {
            reject(err)
          })
        })
      }))
    }).catch(err => {
      console.log(err)
    })
  })
}
