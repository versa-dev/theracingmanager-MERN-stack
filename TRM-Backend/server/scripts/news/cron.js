require('../../setup')
const newsToDB = require('./news')

// for running the code every day at 12
let {CronJob} = require('cron')

let newsCron = new CronJob({
  cronTime: '00 00 12 * * *',
  onTick: () => {
    console.log('Running cron at ', new Date())
    newsToDB()
      .catch(err => {
        throw err
      })
  },
  start: false,
  timeZone: 'Europe/London'
})

// Starting the task
newsCron.start()
