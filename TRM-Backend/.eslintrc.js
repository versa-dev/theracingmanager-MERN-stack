module.exports = {
  'extends': 'standard',

  'env': {
    'node': true
  },

  'rules': {
    'prefer-promise-reject-errors': 0
  },

  'globals': [
    'describe',
    'context',
    'before',
    'beforeEach',
    'after',
    'afterEach',
    'it',
    'expect'
  ].reduce(
    (res, key) => {
      res[key] = true
      return res
    },
    {}
  )
}