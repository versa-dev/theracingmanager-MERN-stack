const {CronJob} = require('cron')
const dataToDB = require('./updateTimeform')

let schedule = new CronJob({
  cronTime: '0 */8 * * *',
  onTick: () => {
    dataToDB().then(() => console.log('success'))
      .catch(err => {
        throw err
      })
  },
  start: true,
  timeZone: 'Europe/London'
})

schedule.start()
