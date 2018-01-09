const User = require('api/user/model')
const {GENERIC} = require('data/messages')
const {FEESTRUCTURE_VLD} = require('utils/validation')

const getFeeInfos = (body, {user}) => {
  return User.findOne({_id: user._id}, 'billings')
    .then(data => Promise.resolve(data.billings.feeInfos))
    .catch(() => Promise.reject({message: GENERIC.NOT_FOUND}))
}

const updateFeeInfos = (body, {user}) => {
  return FEESTRUCTURE_VLD(body)
    .then(data => {
      return User.findOneAndUpdate(
        {
          _id: user._id
        },
        {
          $set: {'billings.feeInfos': data}
        }
      )
    })
    .then(() => Promise.resolve())
    .catch(() => Promise.reject({message: GENERIC.FAILED}))
}

module.exports = {
  getFeeInfos,
  updateFeeInfos
}
