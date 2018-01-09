const UserController = require('api/user/controller')
const {FIRSTNAME} = require('data/messages')

const dummyUser = {
  firstname: 'Test',
  surname: 'Test',
  email: 'test@example.com',
  password: 'Test12'
}

const updatedUser = {
  firstname: 'TestTest'
}

describe('User', () => {
  let user
  beforeEach((done) => {
    UserController.removeAll().then(() => {
      return UserController.create(dummyUser)
    }).then(_user => {
      user = _user
      done()
    })
  })
  describe('/updateUser', () => {
    it('should update existing user', (done) => {
      UserController.updateUser(updatedUser, {user})
        .then(() => {
          return UserController.findById(user._id)
        })
        .then(res => {
          expect(res.firstname).to.equal(updatedUser.firstname)
          done()
        })
    })

    it('should validate on update', (done) => {
      UserController.updateUser({firstname: 'Wrong~2#!'}, {user})
        .catch(err => {
          expect(err.errors.firstname.message).to.equal(FIRSTNAME.ERROR)
          done()
        })
    })
  })
})
