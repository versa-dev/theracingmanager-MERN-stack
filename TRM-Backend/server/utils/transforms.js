const dehyphenize = query => (query.toString() || '').trim().replace(/[-]+/g, ' ').toUpperCase()

const hyphenize = query => query.toString().trim().replace(/[ ]+/g, '-').toLowerCase()

module.exports = {
  dehyphenize,
  hyphenize
}
