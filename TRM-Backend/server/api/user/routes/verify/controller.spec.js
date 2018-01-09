const {createUser} = require('api/user/routes/register/controller')
const {verifyUser} = require('api/user/routes/verify/controller')
const UserController = require('api/user/controller')

const createProps = {
  firstname: 'nick',
  surname: 'the french boy',
  email: 'lovehege@nick.com',
  password: '0loveChrisAlso'
}

describe('User/verify', () => {
  beforeEach((done) => {
    UserController.removeAll().then(() => {
      done()
    })
  })
  describe('/verifyUser', () => {
    it('should verify not verified user', (done) => {
      createUser(
        createProps
      ).then(verification => {
        return verifyUser({
          token: verification
        })
      }).then(res => {
        expect(res.token).to.be.a('string')
        expect(res.user.firstname).to.equal(createProps.firstname)
        done()
      })
    })
  })
})
