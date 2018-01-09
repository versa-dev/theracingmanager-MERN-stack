const genders = {
  f: 'filly',
  c: 'colt',
  g: 'gelding',
  h: 'horse',
  m: 'mare',
  r: 'rig'
}

module.exports = gender => genders[gender.trim()] || 'unknown'
