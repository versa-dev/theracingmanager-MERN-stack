const algoliaClient = require('./algoliaClient')
const getIndexName = require('./getIndexName')

module.exports = ({sortBy, filterBy, modelName, setSettings}) => {
  if (!modelName) { throw new Error('Model name is not defined.') }

  let primaryIndexName = `${global.nodeEnv}${modelName}s`

  let primaryIndex = algoliaClient.initIndex(primaryIndexName)

  let replicaInfos = []
  let replicaNames = []

  // Create sorting replicas
  sortBy.forEach(sortInfo => {
    sortInfo.order.forEach(order => {
      replicaInfos.push({
        field: sortInfo.field,
        order
      })
    })
  })

  replicaInfos.forEach(replicaInfo => {
    replicaNames.push(getIndexName(primaryIndexName, replicaInfo.field, replicaInfo.order))
  })

  // Configure replicas for correct sorting and filtering
  let replicaIndexes = {}

  let attributesForFaceting

  if (setSettings) {
    if (filterBy) {
      attributesForFaceting = Object.keys(filterBy).map(field => (`filterOnly(${field})`))
    }
    console.log(`Set settings for: ${primaryIndexName}`)
    primaryIndex.setSettings({
      replicas: replicaNames,
      attributesForFaceting
    })
  }

  replicaNames.forEach((name, i) => {
    let replicaInfo = replicaInfos[i]
    let replicaIndex = algoliaClient.initIndex(name)

    if (setSettings) {
      console.log(`Set settings for: ${name}`)
      replicaIndex.setSettings({
        ranking: [
          `${replicaInfo.order}(${replicaInfo.field})`,
          'typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'
        ],
        attributesForFaceting
      })
    }
    replicaIndexes[name] = replicaIndex
  })

  return {
    primaryIndex,
    primaryIndexName,
    replicaIndexes
  }
}
