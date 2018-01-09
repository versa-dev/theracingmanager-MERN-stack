const {authenticate, performances, races} = require('scripts/timeform/api')
const {HorseModel} = require('api/horse/model')

const getForm = (body) => {
  const {horseName} = body
  if (horseName === undefined || horseName.trim() === '') {
    return Promise.reject()
  }
  let performs = []

  return HorseModel.findOne({name: horseName}).then(_horse => {
    if (!_horse) {
      return Promise.reject({message: 'no horse'})
    }
    let horseCode = _horse.timeformId
    return authenticate.then(() => {
      return performances.get({
        $filter: `horseCode eq '${horseCode}'`
      }).then(_performances => {
        if (_performances) {
          let promises = []
          _performances.forEach((_performance, i) => {
            performs.push({'performance': _performance})
            let courseId = _performance['courseId']
            let raceNumber = _performance['raceNumber']
            let meetingDate = _performance['meetingDate']
            let race = races.get({
              $filter: `courseId eq ${courseId} and raceNumber eq ${raceNumber} and meetingDate eq DateTime'${meetingDate}'`
            })
            promises.push(race)
          })

          return Promise.all(promises)
        }
      }).then(_races => {
        let newItem = {}
        let newPerforms = []
        _races.forEach((r) => {
          if (r.length > 0) {
            newItem = {}
            newItem.race = r[0]
            newItem.performance = performs.filter(p => {
              if (r[0].courseId === p.performance.courseId && r[0].raceNumber === p.performance.raceNumber && r[0].meetingDate === p.performance.meetingDate) {
                return true
              } else {
                return false
              }
            })[0].performance

            newPerforms.push(newItem)
          }
        })

        performs = []
        performs = newPerforms

        /* grouping */
        let groups = {}
        performs.forEach((item) => {
          let rType = item.race.raceType
          if (!groups[rType]) {
            groups[rType] = []
          }
          groups[rType].push(item)
        })

        // performs = []
        let raceRecord = {}
        let raceRecords = []
        for (var groupName in groups) {
          raceRecord = {}
          raceRecord.type = groupName
          raceRecord.runs = groups[groupName].length
          raceRecord.wins = groups[groupName].filter(
            record => {
              if (record.performance.positionOfficial === 1) {
                return true
              } else {
                return false
              }
            }
          ).length

          raceRecord.second = groups[groupName].filter(
            record => {
              if (record.performance.positionOfficial === 2) {
                return true
              } else {
                return false
              }
            }
          ).length

          raceRecord.third = groups[groupName].filter(
            record => {
              if (record.performance.positionOfficial === 3) {
                return true
              } else {
                return false
              }
            }
          ).length
          var earn = 0
          for (var record in groups[groupName]) {
            earn += parseFloat(groups[groupName][record].race.prizeFundWinner)
          }
          raceRecord.winnings = earn
          raceRecord.earnings = 'not sure'
          raceRecord.or = groups[groupName][0].performance.performanceRating
          raceRecord.bestTS = 'not sure'
          raceRecord.bestRPR = 'not sure'
          raceRecords.push(raceRecord)
        }
        raceRecords = {header: Object.keys(raceRecords[0]), data: raceRecords}
        let formRecord = {}
        let form = []
        performs.forEach((item) => {
          formRecord = {}
          formRecord.date = item.race.meetingDate
          formRecord.course = item.race.courseName
          formRecord.class = item.race.raceClass
          formRecord.type = item.race.raceType
          formRecord.dist = item.race.distance
          formRecord.gng = item.race.going
          formRecord.wgt = item.performance.weightCarried
          formRecord.hdgr = 'not sure'
          formRecord.pos = item.performance.positionOfficial
          formRecord.numberOfRunners = item.race.numberOfRunners
          formRecord.finish = item.race.finishingTime
          formRecord.sp = item.performance.ispFractional
          formRecord.jockey = item.performance.jockeyName
          formRecord.or = item.performance.performanceRating
          formRecord.ts = 'not sure'
          formRecord.bestRPR = 'not sure'
          form.push(formRecord)
        })
        form = {header: Object.keys(form[0]), data: form}
        return Promise.resolve({header: ['raceRecord', 'form'], data: {raceRecord: raceRecords, form: form}})
      })
    })
  }).catch(_err => {
    return Promise.reject(_err)
  })
}

module.exports = {
  getForm
}
