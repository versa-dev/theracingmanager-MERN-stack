const {createMessage, getMessage, removeMessage} = require('api/message/controller')
const {MESSAGE} = require('data/messages')

const createProps = [{
  horseId: '5989b94251aad83124a649fa',
  text: 'hello'
}, {
  user: {
    _id: '5989b94251aad83124a649fa'
  }
}]

describe('Message', () => {
  beforeEach((done) => {
    removeMessage().then(() => {
      done()
    })
  })
  describe('/createMessage', () => {
    it('should create a message', (done) => {
      createMessage.apply(
        null, createProps
      ).then(res => {
        expect(res).to.be.a('string')
        expect(res).to.equal(MESSAGE.SUCCESS)
        done()
      })
    })
  })

  describe('/getMessage', () => {
    it('should get an existing message', (done) => {
      createMessage.apply(
        null, createProps
      ).then(() => {
        return getMessage({
          horseId: createProps[0].horseId
        })
      }).then(res => {
        expect(res).to.be.an('array').of.length(1)
        expect(res[0].text).to.equal(createProps[0].text)
        done()
      })
    })
  })
})
