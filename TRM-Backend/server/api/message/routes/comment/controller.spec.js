const {createUser} = require('api/user/routes/register/controller')
const UserController = require('api/user/controller')
const {createMessage, getMessage, removeMessage} = require('api/message/controller')
const {createComment, getComment} = require('api/message/routes/comment/controller')
const {COMMENT} = require('data/messages')

const createUserProps = {
  firstname: 'nick',
  surname: 'the french boy',
  username: 'totalbanter99',
  email: 'lovehege@nick.com',
  password: '0loveChrisAlso'
}

const createMessageProps = {
  horseId: '5989b94251aad83124a649fa',
  text: 'hello'
}

const options = {}

describe('Message/Comment', () => {
  beforeEach((done) => {
    Promise.all([removeMessage(), UserController.removeAll()])
      .then(() => {
        return createUser(createUserProps)
      })
      .then(() => {
        return UserController.findOne({
          email: createUserProps.email
        })
      })
      .then(res => {
        options.user = res
        done()
      }).catch(err => {
        console.log(err)
      })
  })

  describe('/createComment', () => {
    it('should create a comment', (done) => {
      createMessage(
        createMessageProps,
        options
      ).then(() => {
        return getMessage({
          horseId: createMessageProps.horseId
        })
      }).then(res => {
        return createComment({
          messageId: res[0]._id,
          text: 'hello'
        },
        options
        )
      }).then(res => {
        expect(res).to.be.a('string')
        expect(res).to.equal(COMMENT.SUCCESS)
        done()
      })
    })
  })

  describe('/getComment', () => {
    it('should get an existing comment', (done) => {
      let messageId
      createMessage(
        createMessageProps,
        options
      )
        .then(() => {
          return getMessage({
            horseId: createMessageProps.horseId
          })
        }).then(res => {
          messageId = res[0]._id.toString()
          return createComment({
            messageId,
            text: 'hello'
          },
          options
          )
        }).then(() => {
          return getComment({messageId}, options)
        }).then(res => {
          expect(res).to.be.an('array').of.length(1)
          expect(res[0].messageId.toString()).to.equal(messageId)
          done()
        })
    })
  })
})
