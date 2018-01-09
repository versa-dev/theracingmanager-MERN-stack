const {Controller} = require('api/utils')
const {HorseModel} = require('api/horse/model')

const HorseController = new Controller({
  model: HorseModel,
  methods: {
    getPublicHorse: require('./getPublicHorse'),
    getPrivateHorse: require('./getPrivateHorse'),
    getRandomHorse: require('./getRandomHorse'),
    searchHorse: require('./searchHorse'),
    updateByName: require('./updateByName'),
    getHorses: require('./getHorses')
  }
})

module.exports = HorseController
