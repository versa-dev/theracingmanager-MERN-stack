const { removePrivate } = require('./object')

describe('Utils - object', () => {
  it('should remove private variables', () => {
    let obj = {
      __v: 1,
      _another: 2,
      shouldWork: 3,
      hi: 4
    }
    expect(removePrivate(obj)).to.eql({
      shouldWork: 3,
      hi: 4
    })
  })
})
