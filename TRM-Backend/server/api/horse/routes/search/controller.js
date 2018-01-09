const {authenticate, horses} = require('scripts/timeform/api')

const searchHorses = body => {
  const {horseName, limit} = body

  let query
  if (limit === undefined) {
    query = {
      $filter: `startswith(horseName, '${horseName}')`
    }
  } else {
    if (Number(limit) !== parseInt(limit, 10)) {
      return Promise.reject({message: 'limit must be integer'})
    }
    query = {
      $filter: `startswith(horseName, '${horseName}')`,
      $top: limit
    }
  }

  return authenticate.then(() => {
    return horses.get(query).then(_horses => {
      return Promise.resolve(_horses)
    })
  }).catch(_err => {
    return Promise.reject(_err)
  })
}

module.exports = {
  searchHorses
}
