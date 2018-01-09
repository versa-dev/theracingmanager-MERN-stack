module.exports = (query, {user} = {}) => {
  if (user && user.ownership) {
    let ownership = user.ownership.filter(elem => {
      return elem.horse.toString() === query.horseId.toString()
    })
    if (ownership.length > 0 && ownership[0]) {
      return Promise.resolve(ownership[0].shares)
    }
  }
  return Promise.resolve()
}
