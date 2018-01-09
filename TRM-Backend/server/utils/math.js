const randomNumber = (min, max) => {
  return Math.random() * (max - min) + min
}

const randomInteger = (min, max) => {
  return parseInt(randomNumber(min, max))
}

module.exports = {
  randomNumber,
  randomInteger
}
