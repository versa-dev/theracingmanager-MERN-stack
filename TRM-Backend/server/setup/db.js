const mongoose = require('mongoose')
const config = require('config')

const {host, port, name} = config.get('db')

const url = `mongodb://${host}:${port}/${name}`

mongoose.Promise = global.Promise

const createDBConnection = () => {
  return mongoose.connect(url
  ).then(() => {
    console.log(`Connected to ${name} db`)
    return Promise.resolve()
  }).catch(err => {
    console.log(`Failed to connect to db on: ${url}`)
    return Promise.reject(err)
  })
}

const closeDBConnection = () => {
  let models = mongoose.connection.models
  Object.keys(models).forEach(key => {
    delete models[key]
  })
  mongoose.connection.close()
}

module.exports = {
  createDBConnection,
  closeDBConnection
}
