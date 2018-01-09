const prepareOwnership = require('./prepareOwnership')

const getDashboard = (body, {user}) => {
  return new Promise((resolve, reject) => {
    user.populate('ownership.horse', {
      __v: false,
      timeformId: false,
      timeformComments: false,
      description: false,
      foalingDate: false,
      color: false,
      sire: false,
      dam: false
    }, (err, user) => {
      if (err) return reject(err)
      if (user) {
        let res = {}
        user = user.toObject()

        return prepareOwnership(user.ownership).then(_result => {
          res.ownership = _result
          return resolve(res)
        })
      } else {
        return reject()
      }
    }
    )
  })
}

module.exports = {
  getDashboard
}
