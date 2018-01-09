const getUserDisplayName = user => (user.username || `${user.firstname} ${user.surname}`)

module.exports = {
  getUserDisplayName
}
