const UserModel = require('api/user/model')

const getShares = (body) => {
  let horseId = body
  let totalShares = 0
  let totalSharesPercent = 0
  return UserModel.find().then(_users => {
    _users.forEach(user => {
      if (user.ownership) {
        user.ownership.forEach(share => {
          if (share.horse.equals(horseId)) {
            totalShares += 1
            totalSharesPercent += share.shares
          }
        })
      }
    })
    // return Promise.resolve({horseId: horseId, numOfOwners: totalShares, owned: totalSharesPercent})
    return Promise.resolve({horseId: horseId, total: totalShares, owned: totalSharesPercent})
  })
}

module.exports = getShares
