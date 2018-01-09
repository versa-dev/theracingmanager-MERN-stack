const colors = {
  'b': 'bay',
  'br': 'brown',
  'ch': 'chestnut',
  'gr': 'grey',
  'b  or br': 'bay or brown',
  'b or br': 'bay or brown',
  'ro': 'roan',
  'bl': 'black',
  'gr or ro': 'grey or roan',
  'ro or gr': 'roan or grey',
  'b  or ro': 'brown or roan',
  'ch or br': 'chestnut or brown',
  'bl or br': 'black or brown'
}

module.exports = color => colors[color.trim()] || 'unknown'
