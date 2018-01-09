require('../../setup')
const contegoStatusUpdate = require('./contego')

// for running the code every day at 12
let {CronJob} = require('cron')

let contegoCron = new CronJob({
  cronTime: '00 */4 * * * *',
  onTick: () => {
    console.log('Running cron at ', new Date())
    contegoStatusUpdate()
      .catch(err => {
        throw err
      })
  },
  start: false,
  timeZone: 'Europe/London'
})

// Starting the task
contegoCron.start()
