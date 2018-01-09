const config = require('config')
const express = require('express')
const morgan = require('morgan')
const app = express()
const path = require('path')
const port = config.get('server.port')
const bodyParser = require('body-parser')
const compression = require('compression')
const {errorHandler} = require('bodymen')
const {error} = require('utils/api')

const routes = require('api')
require('api/permissions')

app.use(compression())

if (global.isDev) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
    next()
  })
} else {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://uat.theracingmanager.com')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
    next()
  })
}

app.use(morgan('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const storagePath = config.get('storage.path')
app.use(`/${storagePath}`, express.static(storagePath), (req, res) => {
  res.status(404).send('could not find the file')
})

const assetsPath = config.get('assets.path')
app.use('/assets', express.static(assetsPath))

app.use(require('setup/passport')())

app.use(`/api/v${config.get('api.version')}`, routes)

app.use('/api/*', (req, res) => {
  res.status(404).send({url: `${req.originalUrl} not found`})
})

app.use('/', express.static(path.resolve('./client')))

app.get('/*', (req, res) => {
  res.sendFile(path.resolve('./client/index.html'))
})

app.use(errorHandler())

app.use((err, req, res) => {
  res.status(500).send(error({message: err.message}))
})

app.listen(port)

console.log(`[${global.nodeEnv}] TRM RESTful API server started on: ${port}`)
