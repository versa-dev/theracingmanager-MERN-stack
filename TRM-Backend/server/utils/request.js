const config = require('config')
const path = require('path')
const mime = require('mime')
const {generateThumbnail} = require('./file')
const fs = require('fs-extra')

const assignQueryToBody = (req, res, next) => {
  Object.assign(req.body, req.query)
  next()
}

const assignParamsToBody = (req, res, next) => {
  Object.assign(req.body, req.params)
  next()
}

const _dotToObj = _obj => {
  let obj = Object.assign({}, _obj)
  Object.keys(obj).forEach(key => {
    let val = obj[key]
    let splittedKeys = key.split('.')
    if (splittedKeys.length > 1) {
      let lastObj = obj
      splittedKeys.forEach((splittedKey, i) => {
        if (i === splittedKeys.length - 1) {
          lastObj[splittedKey] = val
        } else {
          lastObj[splittedKey] = lastObj[splittedKey] || {}
          lastObj = lastObj[splittedKey]
        }
      })
      delete obj[key]
    }
  })
  return obj
}

const dotNotationToObject = (req, res, next) => {
  req.body = _dotToObj(req.body)
  next()
}

const bodySelect = (selector = []) => (req, res, next) => {
  Object.keys(req.body).forEach(key => {
    if (selector.indexOf(key) < 0) {
      delete req.body[key]
    }
  })
  next()
}

const prepareQuery = (query, availableQueries, transform = val => val) => {
  if (!query) {
    console.error(`Query is not defined ${JSON.stringify(availableQueries)}`)
    return false
  }
  let result = {}
  availableQueries.forEach((key) => {
    let val = query[key]
    if (val) {
      if (key === '_id') {
        result[key] = val
      } else {
        result[key] = transform(val, key)
      }
      return result
    }
  })
  if (Object.keys(result).length === 0) {
    console.error(`No matching queries ${JSON.stringify(availableQueries)}`)
    return false
  }
  return result
}

const isId = id => id.match(/^[0-9a-fA-F]{24}$/)

const processFile = (file, destination) => {
  const relativePath = `${config.get('storage.path')}/${destination}/${file.filename}`.replace(/\s/g, '-')
  const destinationPath = path.resolve(relativePath)
  return new Promise((resolve, reject) => {
    if (mime.lookup(file.originalname) === file.mimetype) {
      const type = file.mimetype.slice(0, file.mimetype.indexOf('/'))

      let fileObject = {
        fieldName: file.fieldname,
        path: `/${relativePath}`,
        type
      }

      fs.move(
        file.path, destinationPath
      ).then(() => {
        if (type === 'video') {
          generateThumbnail(
            destinationPath
          ).then(thumbnailPath => {
            fileObject.thumbnail = `/${path.relative('./', thumbnailPath)}`
            resolve(fileObject)
          }).catch(reject)
        } else {
          resolve(fileObject)
        }
      }).catch(reject)

      return fileObject
    } else {
      reject({message: 'mime type doesn\'t match extension'})
    }
  })
}

const processFiles = (files, destination) => {
  if (!files) return Promise.resolve()
  if (!Array.isArray(files)) {
    let newFiles = []
    Object.keys(files).forEach(key => {
      newFiles = newFiles.concat(files[key])
    })
    files = newFiles
  }
  return new Promise((resolve, reject) => {
    if (!files || (files && files.length === 0)) {
      resolve(null)
      return
    }
    let promises = []
    files.forEach(file => {
      promises.push(processFile(file, destination))
    })

    Promise.all(
      promises
    ).then(fileObjects => {
      let results = {}
      fileObjects.forEach(fileObject => {
        let fieldName = fileObject.fieldName
        delete fileObject.fieldName
        if (!results[fieldName]) {
          results[fieldName] = []
        }
        results[fieldName].push(fileObject)
      })
      resolve(results)
    }).catch(reject)
  })
}

const processMulterFiles = (files, type, name, destination) => {
  return processFiles(
    files, `${destination}/${Date.now()}-${parseInt(Math.random() * 100)}`
  ).then(filesInfos => {
    let result
    if (filesInfos) {
      let fieldInfo = filesInfos[name]
      if (fieldInfo && fieldInfo.length > 0) {
        switch (type) {
          case 'single':
            result = fieldInfo[0].path
            break
          case 'array':
            result = fieldInfo
            break
        }
      }
    }
    return Promise.resolve(result)
  })
}

module.exports = {
  prepareQuery,
  isId,
  bodySelect,
  dotNotationToObject,
  processFile,
  processFiles,
  processMulterFiles,
  assignQueryToBody,
  assignParamsToBody
}
