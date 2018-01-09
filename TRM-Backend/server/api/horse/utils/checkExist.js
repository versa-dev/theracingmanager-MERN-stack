const {HorseModel} = require('api/horse/model')

const checkExist = (body) => {
  let query
  if (body.name === undefined) {
    query = {timeformId: body.horseCode}
  } else {
    query = {name: body.name}
  }
  return HorseModel.find(query).then(_horses => {
    if (_horses.length > 0) {
      return Promise.resolve('true')
    } else {
      return Promise.resolve('false')
    }
  })
}

module.exports = checkExist
