const express = require('express')

const messageRouter = require('./message/routes')
const horseRouter = require('./horse/routes')
const userRouter = require('./user/routes')
const syndicateRouter = require('./syndicate/routes')
const searchHorseRouter = require('./search/routes')
const setupRouter = require('./setup/routes')
const newsRouter = require('./news/routes')
const statisticsRouter = require('./statistics/routes')
const contactRouter = require('./contact/routes')

const rootRouter = express.Router({mergeParams: true})

rootRouter.use(messageRouter)
rootRouter.use(horseRouter)
rootRouter.use(userRouter)
rootRouter.use(syndicateRouter)
rootRouter.use(searchHorseRouter)
rootRouter.use(setupRouter)
rootRouter.use(newsRouter)
rootRouter.use(statisticsRouter)
rootRouter.use(contactRouter)

module.exports = rootRouter
