const {horseHelper} = require('api/horse/model')
const getHorse = require('./getPublicHorse')

module.exports = (body = {}) => {
  let searchResults
  if (body.query) {
    body.query = body.query.toUpperCase()
  }

  return horseHelper.search(
    body
  ).then(results => {
    let promises = []
    results.hits.forEach(hit => {
      promises.push(getHorse(
        {_id: hit.objectID},
        {
          populate: {
            shares: true
          }
        }
      ))
    })
    searchResults = results
    return Promise.all(promises)
  }).then(horses => {
    let result = {
      resultsAmount: searchResults.nbHits,
      results: horses
    }
    return Promise.resolve(result)
  })
}
