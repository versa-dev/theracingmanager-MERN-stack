if (!global.nodeEnv) {
  Object.defineProperty(global, 'nodeEnv', {
    get: () => (process.env.NODE_ENV || 'local')
  })
}
if (global.isUat === undefined) {
  Object.defineProperty(global, 'isUat', {
    get: () => (global.nodeEnv === 'uat')
  })
}
if (global.isDev === undefined) {
  Object.defineProperty(global, 'isDev', {
    get: () => (global.nodeEnv === 'dev' || global.nodeEnv === 'local')
  })
}
if (global.isLocal === undefined) {
  Object.defineProperty(global, 'isLocal', {
    get: () => (global.nodeEnv === 'local')
  })
}
if (global.isTest === undefined) {
  Object.defineProperty(global, 'isTest', {
    get: () => (global.nodeEnv === 'test')
  })
}
if (!global.devLog) {
  global.devLog = message => {
    if (global.isDev) {
      console.log(message)
    }
  }
}
require('babel-register')
global.Promise = require('bluebird')
require('dotenv').config()

const pe = require('pretty-error').start()

pe.appendStyle({
  'pretty-error > header > message': {
    color: 'red'
  },
  'pretty-error > trace > item > header > pointer > file': {
    color: 'bright-red'
  },

  'pretty-error > trace > item > header > pointer > colon': {
    color: 'grey'
  },

  'pretty-error > trace > item > header > pointer > line': {
    color: 'yellow'
  }
})
