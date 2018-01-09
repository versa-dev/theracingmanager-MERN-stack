require('dotenv').config()
const {authenticate, races, jockeys, entries, countries, trainers, courses, meetings, horses, performances} = require('./api')

describe('Timeform - api', () => {
  describe('Authenticate', () => {
    it('should authenticate', (done) => {
      authenticate.then(() => {
        done()
      })
    })
  })
  describe('Races', () => {
    it('should return an array of length 1 with param $top: 1', (done) => {
      races.get({
        $top: 1
      }).then(body => {
        expect(body.length).to.equal(1)
        done()
      })
    })
  })
  describe('Jockeys', () => {
    it('should return an array of length 1 with param $top: 1', (done) => {
      jockeys.get({
        $top: 1
      }).then(body => {
        expect(body.length).to.equal(1)
        done()
      })
    })
  })
  describe('Entries', () => {
    it('should return an array of length 1 with param $top: 1', (done) => {
      entries.get({
        $top: 1
      }).then(body => {
        expect(body.length).to.equal(1)
        done()
      })
    })
  })
  describe('Countries', () => {
    it('should return an array of length 1 with param $top: 1', (done) => {
      countries.get({
        $top: 1
      }).then(body => {
        expect(body.length).to.equal(1)
        done()
      })
    })
  })
  describe('Trainers', () => {
    it('should return an array of length 1 with param $top: 1', (done) => {
      trainers.get({
        $top: 1
      }).then(body => {
        expect(body.length).to.equal(1)
        done()
      })
    })
  })
  describe('Courses', () => {
    it('should return an array of length 1 with param $top: 1', (done) => {
      courses.get({
        $top: 1
      }).then(body => {
        expect(body.length).to.equal(1)
        done()
      })
    })
  })
  describe('Meetings', () => {
    it('should return an array of length 1 with param $top: 1', (done) => {
      meetings.get({
        $top: 1
      }).then(body => {
        expect(body.length).to.equal(1)
        done()
      })
    })
  })
  describe('Horses', () => {
    it('should return an array of length 1 with param $top: 1', (done) => {
      horses.get({
        $top: 1
      }).then(body => {
        expect(body.length).to.equal(1)
        done()
      })
    })
  })
  describe('Performances', () => {
    it('should return an array of length 1 with param $top: 1', (done) => {
      performances.get({
        $top: 1
      }).then(body => {
        expect(body.length).to.equal(1)
        done()
      })
    })
  })
})
