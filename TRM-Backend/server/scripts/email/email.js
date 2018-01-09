const {sendMail} = require('utils/email')

module.exports = () => {
  let mailData = {
    to: `angulardev1205@gmail.com`,
    subject: `Hi`,
    template: {
      name: `notification`,
      data: {
        content: `Hi, Welcome to TRM`
      }
    }
  }

  return sendMail(mailData).then(_res => {
    return Promise.resolve()
  }).catch(_err => {
    console.log(_err)
    return Promise.reject(_err)
  })
}
