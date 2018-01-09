const {registerUser} = require('api/user/routes/register/controller')
const UserController = require('api/user/controller')
const {FIRSTNAME, REGISTER, EMAIL} = require('data/messages')

const registerProps = {
  firstname: 'nick',
  surname: 'the french boy',
  email: 'lovehege@nick.com',
  password: '0loveChrisAlso'
}

describe('User/register', () => {
  beforeEach((done) => {
    UserController.removeAll().then(() => {
      done()
    })
  })
  describe('/registerUser', () => {
    it('should register a member', (done) => {
      registerUser(
        registerProps
      ).then(res => {
        expect(res.message).to.equal(REGISTER.SUCCESS)
        done()
      })
    })

    it('should reject registration with wrong email', (done) => {
      registerUser(
        Object.assign({}, registerProps, {
          email: 'wrong@email'
        })
      ).catch(err => {
        expect(err.errors.email.message).to.equal(EMAIL.ERROR)
        done()
      })
    })

    it('should reject user with already registered email', (done) => {
      registerUser(
        registerProps
      ).then(res => {
        expect(res.message).to.equal(REGISTER.SUCCESS)
        return registerUser(
          registerProps
        )
      }).catch(err => {
        expect(err.errors.email.message).to.equal(EMAIL.DUPLICATE)
        done()
      })
    })

    it('should reject registration with empty firstname', (done) => {
      registerUser(
        Object.assign({}, registerProps, {
          firstname: ''
        })
      ).catch(err => {
        expect(err.errors.firstname.message).to.equal(FIRSTNAME.REQUIRED)
        done()
      })
    })
  })
})
