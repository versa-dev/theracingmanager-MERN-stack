const fileUtils = require('./file')

describe('Utils - file', () => {
  it('should find correct extension', () => {
    let fileName = 'some/weird/path/small.mp4'
    expect(fileUtils.extension(fileName)).to.equal('mp4')
  })
})
