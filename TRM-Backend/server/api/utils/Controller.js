const {GENERIC, METHODS} = require('data/messages')
const {isObject, removeEmpty} = require('utils/object')

class Controller {
  constructor ({model, methods = {}}) {
    this.model = model
    Object.keys(methods).forEach(key => {
      this[key] = methods[key].bind(this)
    })
  }

  create (body) {
    return this.model.create(
      body
    ).then(res => {
      res.wasNew = true
      return Promise.resolve(res)
    })
  }

  find (query) {
    return this.model.find(query)
  }

  findOne (query = {}) {
    if (Object.keys(query).length === 0) {
      throw new Error('Query is empty')
    }
    if (query.id) {
      return this.findById(query.id)
    }
    return this.model.findOne(query)
  }

  findById (id) {
    return this.model.findById(id)
  }

  updateOne ({query, data}) {
    let _data = removeEmpty(data)
    if (!isObject(_data) || Object.keys(_data).length === 0) {
      return Promise.reject({message: METHODS.MISSING_PARAMETER('data')})
    }
    return this.findOne(
      query
    ).then(res => {
      if (res) {
        return Object.assign(res, _data).save()
      } else {
        return Promise.reject({message: GENERIC.NOT_FOUND})
      }
    })
  }

  updateById ({id, data}) {
    return this.findById(
      id
    ).then(res => {
      return Object.assign(res, data).save()
    })
  }

  updateOrCreate ({query = {}, data}) {
    if (Object.keys(query).length === 0) {
      return this.create(data)
    } else {
      return this.findOne(
        query
      ).then(res => {
        if (res) {
          return this.updateById({
            id: res._id,
            data
          })
        } else {
          return this.create(data)
        }
      })
    }
  }

  createIfNew ({query = {}, data}) {
    if (Object.keys(query).length === 0) {
      return this.create(data)
    } else {
      return this.findOne(
        query
      ).then(res => {
        if (res) {
          return Promise.resolve(res)
        } else {
          return this.create(data)
        }
      })
    }
  }

  removeById (id) {
    return this.model.remove({_id: id})
  }

  removeAll () {
    return this.model.remove()
  }
}

module.exports = Controller
