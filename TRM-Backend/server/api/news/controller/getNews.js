module.exports = function () {
  return this.find().limit(30).sort({date: -1}).select('-__v')
}
