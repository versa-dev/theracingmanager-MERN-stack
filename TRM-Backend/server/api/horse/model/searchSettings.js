const {
  OWNERSHIP_TYPE,
  RACING_TYPE,
  RACING_HISTORY
} = require('./constants')

module.exports = {
  modelName: 'Horse',
  searchableAttributes: ['name', 'trainer.name'],
  sortBy: [
    {
      field: 'shares.available',
      displayName: 'Shares',
      order: ['desc', 'asc']
    },
    {
      field: 'cost.monthly',
      displayName: 'Price',
      order: ['desc', 'asc']
    }
  ],
  filterBy: {
    'age': {
      displayName: 'Age of horse',
      options: [
        {
          values: {
            min: 0,
            max: 2
          },
          displayName: '0-2'
        },
        {
          values: {
            min: 3,
            max: 5
          },
          displayName: '3-5'
        },
        {
          values: {
            min: 6
          },
          displayName: 'Older horse'
        }
      ]
    },
    'racingHistory': {
      displayName: 'Racing history',
      values: RACING_HISTORY
    },
    'cost.monthly': {
      displayName: 'Monthly cost per 1%',
      values: {
        // These numbers come from the fact that it is currently randomized value
        // TODO: Calculate it using Algolia facades
        min: 2500,
        max: 7500
      }
    },
    'racingType': {
      displayName: 'Racing type',
      values: RACING_TYPE
    },
    'ownership.years': {
      displayName: 'Number of years',
      default: 2,
      values: {
        min: 0
      }
    },
    'ownership.type': {
      displayName: 'Ownership type',
      values: OWNERSHIP_TYPE
    }
  },
  selector: [
    'name',
    'age',
    'racingType',
    'cost',
    'ownership',
    'owner',
    'trainer.name'
  ],
  mappings: {
    shares: (value) => ({
      available: (100 - value) / 100
    })
  },
  virtuals: {
    racingHistory: horse => (horse.performances ? horse.performances.length > 0 ? RACING_HISTORY[1] : RACING_HISTORY[0] : RACING_HISTORY[0])
  }
}
