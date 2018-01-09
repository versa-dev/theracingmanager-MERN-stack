const mongooseAlgolia = require('mongoose-algolia')
const generateConditions = require('./generateConditions')
const createIndexes = require('./createIndexes')
const getIndexName = require('./getIndexName')
const {ALGOLIA_APP_ID, ALGOLIA_API_KEY} = process.env

module.exports = (schema, options = {}) => {
  const {primaryIndex, primaryIndexName, replicaIndexes} = createIndexes({
    sortBy: options.sortBy,
    modelName: options.modelName
  })

  if (Array.isArray(options.selector)) {
    if (options.virtuals) {
      options.selector = options.selector.concat(Object.keys(options.virtuals))
    }
    options.selector = options.selector.join(' ')
  }
  options.appId = ALGOLIA_APP_ID
  options.apiKey = ALGOLIA_API_KEY

  options.indexName = primaryIndexName

  options.debug = true

  schema.plugin(mongooseAlgolia, options)

  let searchHelper = {
    search: ({query, filter, sort}) => {
      let searchIndex
      if (sort && Object.keys(sort).length > 0) {
        searchIndex = replicaIndexes[getIndexName(primaryIndexName, sort.field, sort.order)]
      } else {
        searchIndex = primaryIndex
      }
      if (searchIndex) {
        let filterConditions = generateConditions(filter)
        let filters = filterConditions.join(' AND ')
        return searchIndex.search({
          query,
          filters
        })
      } else {
        return Promise.reject({message: 'Unsupported sorting strategy'})
      }
    }
  }

  return searchHelper
}
