const Syndicate = require('api/syndicate/model')
module.exports = (body) => {
  let syndicateDetail = body
  if (syndicateDetail.syndicate.name === undefined ||
    syndicateDetail.syndicator.email === undefined ||
    syndicateDetail.syndicate.address1 === undefined ||
    syndicateDetail.syndicate.city === undefined ||
    syndicateDetail.syndicator.firstname === undefined ||
    syndicateDetail.syndicator.surname === undefined) {
    return Promise.reject({message: 'wrong paramaters'})
  }
  return Syndicate.findOne(
    {name: syndicateDetail.syndicate.name}
  ).then(syndicate => {
    if (syndicate) {
      return Promise.reject({message: 'syndicate already exist'})
    } else {
      Syndicate.create({
        owner: {
          firstname: syndicateDetail.syndicator.firstname,
          surname: syndicateDetail.syndicator.surname,
          email: syndicateDetail.syndicator.email
        },
        address1: syndicateDetail.syndicate.address1,
        address2: syndicateDetail.syndicate.address2,
        city: syndicateDetail.syndicate.city,
        name: syndicateDetail.syndicate.name.toUpperCase(),
        approved: 0
      }).then(res => {
        return Promise.resolve(res)
      })
    }
  })
}
