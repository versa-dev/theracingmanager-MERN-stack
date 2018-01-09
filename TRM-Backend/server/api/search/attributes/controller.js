const searchSettings = require('api/horse/model/searchSettings')

const getAttributes = () => {
  let result = {
    sort: [],
    filter: searchSettings.filterBy
  }
  searchSettings.sortBy.forEach(searchInfo => {
    result.sort.push({
      field: searchInfo.field,
      values: searchInfo.order.map(order => ({
        order,
        displayName: `${searchInfo.displayName} ${order === 'asc' ? 'lowest to highest' : 'highest to lowest'}`
      }))
    })
  })

  return Promise.resolve(result)
}

module.exports = {
  getAttributes
}
