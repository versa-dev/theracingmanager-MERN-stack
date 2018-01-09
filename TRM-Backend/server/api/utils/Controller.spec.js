const {Controller} = require('api/utils')
const mongoose = require('mongoose')
const {Schema} = mongoose

const TestSchema = new Schema({
  name: {
    type: String
  }
})

let saveCalled = 0
TestSchema.pre('save', function (next) {
  saveCalled++
  next()
})

const TestModel = mongoose.model('Test', TestSchema)

const TestController = new Controller({
  model: TestModel
})

const props = {
  name: 'Test'
}

const altProps = {
  name: 'New'
}

describe('api/utils/Controller', () => {
  beforeEach((done) => {
    saveCalled = 0
    TestController.removeAll()
      .then(() => {
        done()
      })
  })

  describe('/create', () => {
    it('should call save hook once', (done) => {
      TestController.create(props)
        .then(res => {
          expect(res.wasNew).to.equal(true)
          expect(saveCalled).to.equal(1)
          done()
        })
    })
  })

  describe('/updateOne', () => {
    it('should call save hook once', (done) => {
      TestController.create(props).then(res => {
        saveCalled = 0
        return TestController.updateOne({
          query: {
            name: res.name
          },
          data: altProps
        })
      }).then(() => {
        expect(saveCalled).to.equal(1)
        done()
      })
    })
  })

  describe('/updateById', () => {
    it('should call save hook once', (done) => {
      TestController.create(props).then(res => {
        saveCalled = 0
        return TestController.updateById({
          id: res._id,
          data: altProps
        })
      }).then(() => {
        expect(saveCalled).to.equal(1)
        done()
      })
    })
  })

  describe('/updateOrCreate', () => {
    it('should create when there is none', (done) => {
      TestController.updateOrCreate({
        query: props,
        data: altProps
      }).then(res => {
        expect(res.wasNew).to.equal(true)
        expect(saveCalled).to.equal(1)
        done()
      })
    })

    it('should update when there is one', (done) => {
      TestController.create(
        props
      ).then(res => {
        saveCalled = 0
        return TestController.updateOrCreate({
          query: {
            id: res._id
          },
          data: altProps
        })
      }).then(res => {
        expect(res.wasNew).to.not.equal(true)
        expect(saveCalled).to.equal(1)
        done()
      })
    })
  })
})
