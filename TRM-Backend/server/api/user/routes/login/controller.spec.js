const {createUser, registerUser} = require('api/user/routes/register/controller')
const {loginUser} = require('api/user/routes/login/controller')
const {verifyUser} = require('api/user/routes/verify/controller')
const UserController = require('api/user/controller')
const {AUTHENTICATION, REGISTER, EMAIL} = require('data/messages')
const {NOT_VERIFIED} = require('data/statusCodes')

const registerProps = {
  firstname: 'nick',
  surname: 'the french boy',
  email: 'lovehege@nick.com',
  password: '0loveChrisAlso'
}

const loginProps = {
  email: registerProps.email,
  password: registerProps.password
}

describe('User/login', () => {
  beforeEach((done) => {
    UserController.removeAll().then(() => {
      done()
    })
  })
  describe('/loginUser', () => {
    it('should reject not existing user', (done) => {
      loginUser(
        loginProps
      ).catch(err => {
        expect(err.message).to.equal(AUTHENTICATION.ERROR)
        done()
      })
    })

    it('should reject not verified user', (done) => {
      registerUser(
        registerProps
      ).then(res => {
        expect(res.message).to.equal(REGISTER.SUCCESS)
        return loginUser(
          loginProps
        )
      }).catch(err => {
        expect(err.status).to.equal(NOT_VERIFIED)
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

    it('should login verified user', (done) => {
      createUser(
        registerProps
      ).then(verification => {
        return verifyUser({
          token: verification
        })
      }).then(res => {
        expect(res.token).to.be.a('string')
        return loginUser(
          loginProps
        )
      }).then(res => {
        expect(res.token).to.be.a('string')
        done()
      })
    })
  })
})
