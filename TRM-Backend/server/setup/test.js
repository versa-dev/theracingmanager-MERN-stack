process.env.NODE_ENV = 'test'

require('./base')

const config = require('config')
const port = config.get('server.port')
const apiVersion = config.get('api.version')
const path = require('path')
const {createDBConnection, closeDBConnection} = require('./db')
const chai = require('chai')
const dirtyChai = require('dirty-chai')

chai.use(dirtyChai)

global.expect = chai.expect

global.api = `http://localhost:${port}/api/v${apiVersion}/`

let samplesPath = path.resolve('./samples')
global.samples = {
  video: samplesPath + '/video.mp4',
  image: samplesPath + '/image.jpg',
  audio: samplesPath + '/audio.jpg'
}

before((done) => {
  createDBConnection().then(done)
})

after(() => {
  closeDBConnection()
})
