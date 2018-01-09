const HorseController = require('api/horse/controller')

// const {METHODS} = require('data/messages')
//
// const requiredProps = {
//   name: 'To Be Nick'
// }

describe('Horse', () => {
  beforeEach((done) => {
    HorseController.removeAll().then(() => {
      done()
    })
  })
  // describe('/getHorse', () => {
  //   it('should return not found when no horses', (done) => {
  //     HorseController.getPublicHorse(
  //       requiredProps
  //     ).catch(err => {
  //       expect(err.message).to.equal(METHODS.HORSE.NOT_FOUND(requiredProps.name))
  //       done()
  //     })
  //   })
  //
  //   it('should find existing horse', (done) => {
  //     HorseController.create(
  //       requiredProps
  //     ).then(res => {
  //       return HorseController.getPublicHorse({_id: res._id})
  //     }).then(res => {
  //       expect(res).to.exist()
  //       done()
  //     })
  //   })
  // })
})
