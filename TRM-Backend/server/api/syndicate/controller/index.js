const {Controller} = require('api/utils')
const SyndicateModel = require('api/syndicate/model')

const SyndicateController = new Controller({
  model: SyndicateModel,
  methods: {
    getPublicSyndicate: require('./getPublicSyndicate'),
    getPrivateSyndicate: require('./getPrivateSyndicate'),
    updateByName: require('./updateByName'),
    registerExisting: require('./registerExisting'),
    registerNew: require('./registerNew'),
    addHorse: require('./addHorse'),
    getHorses: require('./getHorses'),
    removeHorse: require('./removeHorse'),
    addMembers: require('./addMembers'),
    removeMember: require('./removeMember'),
    getOwners: require('./getOwners'),
    getMembers: require('./getMembers'),
    assignShares: require('./assignShares'),
    registerOwners: require('./registerOwners'),
    updateOwner: require('./updateOwner'),
    removeOwner: require('./removeOwner'),
    message: require('./message')
  }
})

module.exports = SyndicateController
