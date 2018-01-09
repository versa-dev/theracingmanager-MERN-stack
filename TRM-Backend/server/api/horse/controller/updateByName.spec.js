const HorseController = require('api/horse/controller')
const {GENERIC, METHODS} = require('data/messages')

const oldHorse = {
  name: 'Test'
}

const newHorse = {
  name: oldHorse.name,
  description: 'Test test'
}

describe('Horse', () => {
  beforeEach((done) => {
    HorseController.removeAll().then(() => {
      return HorseController.create(oldHorse)
    }).then(() => {
      done()
    })
  })
  describe('/updateByName', () => {
    it('should update existing horse', (done) => {
      HorseController.updateByName(newHorse)
        .then(() => {
          return HorseController.findOne(oldHorse)
        })
        .then(horse => {
          expect(horse.description).to.equal(newHorse.description)
          done()
        })
    })
    it('should not update not existing horse', (done) => {
      HorseController.updateByName({
        name: 'Not existing',
        description: newHorse.description
      })
        .catch(err => {
          expect(err.message).to.equal(GENERIC.NOT_FOUND)
          done()
        })
    })
    it('should not update with name only', (done) => {
      HorseController.updateByName({
        name: 'Not existing'
      })
        .catch(err => {
          expect(err.message).to.equal(METHODS.MISSING_PARAMETER('data'))
          done()
        })
    })
    it('should not update with data only', (done) => {
      HorseController.updateByName({
        description: newHorse.description
      })
        .catch(err => {
          expect(err.message).to.equal(METHODS.MISSING_PARAMETER('name'))
          done()
        })
    })
  })
})
