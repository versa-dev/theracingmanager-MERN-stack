const {sendGcm} = require('utils/gcm')

module.exports = () => {
  let deviceTokens = ['cVzj63vZXhQ:APA91bGyQMpN27NJQVjYLjSQRs3EN0rxxaHFb5ytim4gpMdg3kinqshDanpWYU6iz7xx-CFYnBnlU6mByla1KKSmpszRrMHllDBFdIjH0nEHe1BUvskJmyQODZ8QxDU7_5Kz_fYhRYGL']
  let message = 'Welcome to TRM'
  let payload = {
    horseName: 'TOBE'
  }

  return sendGcm(deviceTokens, message, payload).then(_res => {
    return Promise.resolve()
  }).catch(_err => {
    console.log(_err)
    return Promise.reject(_err)
  })
}
