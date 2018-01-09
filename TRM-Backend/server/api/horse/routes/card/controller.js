const {authenticate, entries, races, performances} = require('scripts/timeform/api')
const {HorseModel} = require('api/horse/model')

const getFutureEntries = body => {
  const {horseName} = body
  if (horseName === undefined || horseName.trim() === '') {
    return Promise.reject()
  }
  let result = []

  return HorseModel.findOne({name: horseName}).then(_horse => {
    if (!_horse) {
      return Promise.reject({ message: 'no horse' })
    }
    let horseCode = _horse.timeformId
    return authenticate.then(() => {
      return entries.get({
        $filter: `horseCode eq '${horseCode}'`
      }).then(_entries => {
        let futureEntries = []
        let now = Date.now()

        _entries.forEach((entry) => {
          let meetingDate = new Date(entry.meetingDate).getTime()
          if (now - meetingDate <= 0) { // future entries
            futureEntries.push(entry)
          }
        })

        let promises = []
        futureEntries.forEach((entry) => {
          let courseId = entry['courseId']
          let raceNumber = entry['raceNumber']
          let meetingDate = entry['meetingDate']
          let race = races.get({
            $filter: `courseId eq ${courseId} and raceNumber eq ${raceNumber} and meetingDate eq DateTime'${meetingDate}'`,
            $expand: `entries,`
          })
          promises.push(race)
        })

        return Promise.all(promises)
      })
    }).then(_races => {
      let record = {}
      let horse = []
      let entry = {}
      let horseIds = []

      _races.forEach((r) => {
        record = {}
        record.meetingDate = r[0].meetingDate
        record.courseName = r[0].courseName

        horse = []
        r[0].entries.forEach(_entry => {
          entry = {}
          entry.no = _entry.entryNumber
          entry.form = 'not sure'
          entry.name = _entry.horseName
          entry.age = _entry.horseAge
          entry.wgt = _entry.weightCarried
          entry.jockey = _entry.jockeyName
          entry.trainer = _entry.trainerName
          entry.horseCode = _entry.horseCode

          if (horseIds.indexOf(_entry.horseCode) < 0) {
            horseIds.push(_entry.horseCode)
          }
          horse.push(entry)
        })

        record.horses = horse
        result.push(record)
      })

      let promises = []
      horseIds.forEach((horseId, i) => {
        let performance = performances.get({
          $filter: `horseCode eq '${horseId}'`,
          $orderby: `meetingDate desc`,
          $top: 5
        })
        promises.push(performance)
      })

      return Promise.all(promises)
    }).then(_performances => {
      let horseDetail = []
      let horseRecord = []

      _performances.forEach(_horse => {
        let horseCode = _horse[0].horseCode
        horseRecord = []
        _horse.forEach(_race => {
          if (parseInt(_race.positionOfficial)) {
            horseRecord.push(_race.positionOfficial)
          }
        })
        horseDetail.push({horseCode: horseCode, record: horseRecord})
      })

      result.forEach(_result => {
        _result.horses.forEach(_horse => {
          _horse.form = horseDetail.filter(h => {
            if (h.horseCode === _horse.horseCode) {
              return true
            } else {
              return false
            }
          })[0].record
        })
      })

      return Promise.resolve(result)
    })
  }).catch(_err => {
    return Promise.reject(_err)
  })
}

module.exports = {
  getFutureEntries
}
