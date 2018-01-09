const {performances} = require('./api')

const SyndicateController = require('api/syndicate/controller')
const HorseController = require('api/horse/controller')
const {mockHandleUpload} = require('utils/mock')
const {randomInteger} = require('utils/math')

const convert = require('./convertFields')

const colors = [
  '#FFF2C7',
  '#f78e1e',
  '#1fb259',
  '#ee2e23',
  '#b30337',
  '#542989',
  '#a0cced',
  '#004890',
  '#6db43e',
  '#b3a1cd',
  '#006351',
  '#e7e7e7',
  '#959ca1',
  '#0068b3',
  '#794440',
  '#12242f',
  '#fff352',
  '#fac8ca'
]

const getRandomColor = () => {
  let letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const getSyndicateColor = () => (colors.pop() || getRandomColor())

module.exports = (horse, additionalData = {}) => {
  if (horse) {
    console.log(`Processing: ${horse.horseName}`)
    let horseData

    return new Promise((resolve, reject) => {
      performances.get({
        $filter: `horseCode eq '${horse.horseCode}'`
      }).then(performances => {
        horseData = convert.horse(horse)
        let performancesData = []
        performances.forEach(performance => {
          performancesData.push(convert.performance(performance))
        })

        horseData.performances = performancesData
        horseData = Object.assign(horseData, additionalData)
        horseData.name = horseData.name.toUpperCase()

        let syndicateData = {}
        if (horseData.syndicate) {
          // horseData.owner = horseData.syndicate.name || horseData.owner
          syndicateData = horseData.syndicate
          let {featuredImage, logo} = syndicateData
          return mockHandleUpload({
            data: syndicateData,
            paths: {
              featuredImage,
              logoImage: logo
            },
            destination: 'syndicates'
          })
        } else {
          return Promise.resolve()
        }
      }).then(syndicateData => {
        horseData.owner.name = horseData.owner.name.toUpperCase()
        let syndicateName
        if (syndicateData === undefined) {
          syndicateName = horseData.owner.name
        } else {
          syndicateName = syndicateData.hasOwnProperty('name') ? syndicateData.name : horseData.owner.name
        }

        let mainColor = {}
        mainColor.body = getSyndicateColor()
        mainColor.sleeves = getSyndicateColor()
        mainColor.cap = getSyndicateColor()

        let data = Object.assign(
          {
            color: getSyndicateColor(),
            mainColor: mainColor,
            owner: {firstname: syndicateName},
            approved: 1
          },
          syndicateData
        )
        data.name = syndicateName
        return SyndicateController.createIfNew({
          query: {
            name: data.name.toUpperCase()
          },
          data
        })
      }).then(syndicate => {
        let syndicateDetail = {}
        syndicateDetail._id = syndicate._id
        horseData.syndicate = syndicateDetail

        horseData.racingType = Math.random() > 0.6 ? 'National Hunt' : Math.random() > 0.3 ? 'Flat Racing' : 'Dual Purpose'
        horseData.ownership = {
          type: Math.random() > 0.5 ? 'Fixed Period' : 'Open Ended Period'
        }
        horseData.ownershipType = Math.random() > 0.5 ? 'Owned' : 'Leased'
        horseData.teamSize = Math.floor(Math.random() * 100)

        if (horseData.ownership.type === 'Open Ended Period') {
          horseData.ownership.years = randomInteger(1, 6)
        }
        horseData.cost = {
          monthly: randomInteger(500, 1500) * 5,
          initial: randomInteger(2100, 4500) * 5
        }

        return mockHandleUpload({
          data: horseData,
          paths: {
            featuredImage: additionalData.img,
            thumbnailImage: additionalData.thumbnail
          },
          destination: 'horses'
        })
      }).then(horseData => {
        let timeformId = horse.horseCode.trim()

        return HorseController.updateOrCreate({
          query: {timeformId},
          data: horseData
        })
      }).then(savedHorse => {
        resolve()
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  }
}
