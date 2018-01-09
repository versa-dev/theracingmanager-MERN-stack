const SyndicateController = require('api/syndicate/controller')
const {GENERIC, METHODS} = require('data/messages')

const oldSyndicate = {
  name: 'Test'
}

const newSyndicate = {
  name: oldSyndicate.name,
  description: 'test test'
}

describe('syndicate', () => {
  beforeEach((done) => {
    SyndicateController.removeAll().then(() => {
      return SyndicateController.create(oldSyndicate)
    }).then(() => {
      done()
    })
  })
  describe('/updateByName', () => {
    it('should update existing syndicate', (done) => {
      SyndicateController.updateByName(newSyndicate)
        .then(() => {
          return SyndicateController.findOne({
            name: newSyndicate.name
          })
        })
        .then(syndicate => {
          expect(syndicate.description).to.equal(newSyndicate.description)
          done()
        })
    })
    it('should not update not existing syndicate', (done) => {
      SyndicateController.updateByName({
        name: 'Not existing',
        description: newSyndicate.description
      })
        .catch(err => {
          expect(err.message).to.equal(GENERIC.NOT_FOUND)
          done()
        })
    })
    it('should not update with name only', (done) => {
      SyndicateController.updateByName({
        name: 'Not existing'
      })
        .catch(err => {
          expect(err.message).to.equal(METHODS.MISSING_PARAMETER('data'))
          done()
        })
    })
    it('should not update with data only', (done) => {
      SyndicateController.updateByName({
        description: newSyndicate.description
      })
        .catch(err => {
          expect(err.message).to.equal(METHODS.MISSING_PARAMETER('name'))
          done()
        })
    })
  })
})
