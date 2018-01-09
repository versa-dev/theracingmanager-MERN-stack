const {HorsePerformanceModel, HorseRaceModel, HorseEntryModel} = require('api/horse/model')
const {HorseModel} = require('api/horse/model')
const {entries, races, performances} = require('scripts/timeform/api')
const {METHODS} = require('data/messages')
const {dehyphenize} = require('utils/transforms')
const {safeTrim} = require('utils/object')

const getStatistics = (body, {user}) => {
  let {slug} = body
  let horseName = dehyphenize(slug)
  if (!horseName || !horseName.trim()) {
    return Promise.reject({
      message: METHODS.HORSE.NOT_FOUND('Horse name')
    })
  }
  return HorsePerformanceModel.find(
    {horseName: `${horseName}`},
    {_id: 0, __v: 0}
  ).then(performanceData => {
    if (performanceData.length > 0) {
      performanceData.sort((a, b) => {
        if (new Date(b.meetingDate).getTime() > new Date(a.meetingDate).getTime()) {
          return 1
        } else {
          return -1
        }
      })
      return Promise.all(performanceData.map(cur => {
        return HorseRaceModel.find(
          {
            raceNumber: `${cur.raceNumber}`,
            courseId: `${cur.courseId}`,
            meetingDate: `${cur.meetingDate}`
          },
          {_id: 0, __v: 0}
        ).then(race => {
          if (race && race.length > 0) {
            return Promise.resolve(Object.assign(cur.toObject(), race[0].toObject()))
          }
          return Promise.resolve(cur)
        })
      }))
    }
    return Promise.reject({
      message: METHODS.HORSE.NOT_FOUND('datas')
    })
  }).then(data => {
    return Promise.all(data.map(cur => {
      return HorseEntryModel.find(
        {
          courseName: `${cur.courseName}`,
          horseName: `${cur.horseName}`,
          meetingDate: `${cur.meetingDate}`,
          raceNumber: `${cur.raceNumber}`
        },
        {_id: 0, __v: 0}
      ).then(entry => {
        if (entry && entry.length > 0) {
          cur.silkCode = entry[0].silkCode
          cur.entryNumber = entry[0].entryNumber
          cur.BHARating = entry[0].BHARating
          cur.formFigures = entry[0].formFigures
        }
        return Promise.resolve(cur)
      })
    }))
  }).catch(err => Promise.reject(err))
}
const getRanking = (body, {user}) => {
  return getStatistics(body, {user: user}).then(_statisistics => {
    let result = {}
    _statisistics.forEach(stat => {
      if (stat.raceType !== undefined) {
        if (!(stat.raceType in result)) {
          result[stat.raceType] = []
        } else {
          result[stat.raceType].push(stat)
        }
      }
    })

    let returnValue = []
    for (let raceType in result) {
      let wins = 0
      let places = 0
      let best = 0
      result[raceType].forEach(item => {
        if (item.positionOfficial === '1') {
          wins += 1
        } else if (item.positionOfficial === '2' || item.positionOfficial === '3') {
          places += 1
        }
        if (item.performanceRating > best) {
          best = item.performanceRating
        }
      })
      returnValue.push({
        CODE: raceType,
        RUNS: result[raceType].length,
        WINS: wins,
        PLACES: places,
        BEST: best
      })
    }
    return Promise.resolve(returnValue)
  })
}

/** old code
 * get entries data from trm db
 *
const getEntries = (body, {user}) => {
  return getStatistics(body, {user: user}).then(_statisistics => {
    const entries = _statisistics.map(entry => {
      return {
        DATE: entry.meetingDate,
        TIME: entry.startTimeLocalScheduled,
        COURSE: entry.courseName,
        RACE: entry.raceType,
        DIS: entry.distance
      }
    })
    return Promise.resolve(entries)
  })
}
*/

const getEntries = (body, {user}) => {
  const {slug} = body
  if (slug === undefined || slug.trim() === '') {
    return Promise.reject({message: 'slug is missing'})
  }
  let result = []

  return HorseModel.findOne({name: slug}).then(_horse => {
    if (!_horse) {
      return Promise.reject({ message: 'invalid horse' })
    }
    let horseCode = _horse.timeformId

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

    _races.forEach((r) => {
      record = {}
      record.DATE = r[0].meetingDate
      record.COURSE = r[0].courseName.slice(0, 1).toUpperCase() + r[0].courseName.slice(1, 3).toLowerCase()
      record.TIME = r[0].startTimeLocalScheduled
      record.RACE = r[0].raceTitle
      record.DIS = r[0].distance

      result.push(record)
    })

    result.sort((a, b) => {
      return new Date(a.TIME).getTime() > new Date(b.TIME).getTime() ? 1 : -1
    })

    return Promise.resolve(result)
  }).catch(_err => {
    console.log(_err)
    return Promise.reject(_err)
  })
}

const getResults = (body, {user}) => {
  return getStatistics(body, {user: user}).then(_statisistics => {
    let results = []
    results = _statisistics.map(entry => {
      if (entry.numberOfRunners !== undefined) {
        return {
          DATE: entry.meetingDate,
          COURSE: entry.courseName,
          RESULT: entry.positionOfficial + '/' + entry.numberOfRunners,
          BTN: entry.distanceCumulative,
          TYPE: entry.raceSurfaceName,
          OR: entry.handicapMark,
          DIS: entry.distance,
          GOING: entry.going,
          EQ: entry.equipmentChar,
          JOCKEY: entry.jockeyName,
          ISP: entry.ispFractional,
          BSP: entry.betfairWinSP,
          IP: (entry.ipMax / entry.ipMin).toFixed(2),
          IPS: entry.ipSymbols,
          TFIG: entry.timefigure,
          COMMENT: entry.performanceCommentPremium
        }
      }
    })

    results = results.filter(_r => {
      return !!_r
    })

    return Promise.resolve(results)
  })
}

/**
 * old code
 * get entry from trm db
const getEntry = (body, {user}) => {
  const {meetingDate} = body
  return getStatistics(body, {user: user}).then(_statisistics => {
    _statisistics = _statisistics.filter(entry => {
      return (meetingDate === entry.meetingDate)
    })
    const entries = _statisistics.map(item => {
      return {
        EntryNumber: item.entryNumber,
        Form: item.formFigures,
        SilkCode: item.silkCode,
        horseName: item.horseName,
        Jockey: item.jockeyName,
        Trainer: item.trainerName,
        HorseAge: item.horseAge,
        BHARating: item.BHARating,
        TopRated: item.topRated
      }
    })
    return Promise.resolve(entries)
  })
}
 */

const getEntry = (body, {user}) => {
  const {slug, meetingDate} = body
  if (slug === undefined || slug.trim() === '') {
    return Promise.reject({message: 'slug is missing'})
  }
  if (meetingDate === undefined || meetingDate.trim() === '') {
    return Promise.reject({message: 'meetingDate is missing'})
  }
  let hrs = []

  return HorseModel.findOne({name: slug}).then(_horse => {
    if (!_horse) {
      return Promise.reject({ message: 'no horse' })
    }
    let horseCode = _horse.timeformId

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
    }).then(_races => {
      let entry = {}

      let race = _races.filter(_r => {
        return _r[0].meetingDate.toString() === safeTrim(meetingDate)
      })

      if (!race || race.length === 0) {
        return Promise.reject({message: 'invalid meeting time'})
      }

      race = race[0]

      race[0].entries.forEach(_entry => {
        entry = {}
        entry.EntryNumber = _entry.entryNumber
        entry.horseName = _entry.horseName
        entry.HorseAge = _entry.horseAge
        entry.Jockey = _entry.jockeyName
        entry.Trainer = _entry.trainerName
        entry.BHARating = _entry.BHARating
        entry.SilkCode = _entry.silkCode
        entry.Form = _entry.formFigures
        entry.TopRated = _entry.topRated

        if (entry.EntryNumber > 0) { // only add horses available in the race
          hrs.push(entry)
        }
      })
      hrs.sort((a, b) => {
        return a.EntryNumber > b.EntryNumber ? 1 : -1
      })
      return Promise.resolve(hrs)
    })
  }).catch(_err => {
    return Promise.reject(_err)
  })
}

const getResult = (body, {user}) => {
  let {meetingDate} = body
  let hrs = []
  return getStatistics(body, {user: user}).then(_statisistics => {
    _statisistics = _statisistics.filter(result => {
      return meetingDate === result.meetingDate
    })
    if (_statisistics.length === 0) {
      return Promise.reject({message: 'invalid meeting date'})
    }

    _statisistics = _statisistics[0]

    let courseId = _statisistics.courseId
    let raceNumber = _statisistics.raceNumber

    return races.get({
      $filter: `courseId eq ${courseId} and raceNumber eq ${raceNumber} and meetingDate eq DateTime'${meetingDate}'`,
      $expand: `entries,`
    }).then(_race => {
      if (!_race || _race.length === 0) {
        return Promise.reject({message: 'no result'})
      }
      let horseIds = []
      let race = _race[0]
      let entry = {}

      race.entries.forEach(_entry => {
        entry = {}
        entry.EntryNumber = _entry.entryNumber
        entry.HORSENAME = _entry.horseName
        entry.AGE = _entry.horseAge
        entry.JOCKEY = _entry.jockeyName
        entry.TRAINER = _entry.trainerName
        entry.BHARATING = _entry.BHARating
        entry.SILKCODE = _entry.silkCode
        entry.TOPRATED = _entry.topRated
        entry.horseCode = _entry.horseCode

        if (entry.EntryNumber > 0) { // only add horses available in the race
          hrs.push(entry)
          if (horseIds.indexOf(_entry.horseCode) < 0) {
            horseIds.push(_entry.horseCode)
          }
        }
      })

      let promises = []
      horseIds.forEach((horseId, i) => {
        let performance = performances.get({
          $filter: `horseCode eq '${horseId}' and courseId eq ${courseId} and raceNumber eq ${raceNumber} and meetingDate eq DateTime'${meetingDate}'`
        })
        promises.push(performance)
      })

      return Promise.all(promises)
    }).then(_performances => {
      _performances = _performances.map(_p => {
        return _p[0]
      })
      hrs.forEach(_h => {
        let pHorses = _performances.filter(_p => {
          return _p.horseCode === _h.horseCode
        })
        if (pHorses) {
          _h.POSITION = pHorses[0].positionOfficial
          _h.TFR = pHorses[0].performanceRating
          _h.SYMBOL = pHorses[0].performanceSymbol
          _h.ISP = pHorses[0].ispFractional
          _h.COMMENT = pHorses[0].performanceCommentPremium
        }
        delete _h.horseCode
        delete _h.EntryNumber
      })

      hrs.sort((a, b) => {
        return a.POSITION > b.POSITION ? 1 : -1
      })

      let pus = hrs.filter(_h => {
        return _h.POSITION === 0
      }).length

      if (pus > 0) {
        hrs = hrs.slice(pus).concat(hrs.slice(0, pus))
      }

      hrs.forEach(_h => {
        if (_h.POSITION === 0) {
          _h.POSITION = 'pu'
        }
      })
      return Promise.resolve(hrs)
    }).catch(_err => {
      console.log(_err)
      return Promise.reject(_err)
    })
  })
}

module.exports = {
  getStatistics,
  getRanking,
  getResults,
  getResult,
  getEntries,
  getEntry
}
