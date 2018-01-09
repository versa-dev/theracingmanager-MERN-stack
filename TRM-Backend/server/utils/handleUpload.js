const multer = require('multer')
const mime = require('mime')
const path = require('path')
const config = require('config')
const {extension} = require('utils/file')
const {processMulterFiles} = require('utils/request')
const mkdirp = require('mkdirp')
const {error} = require('utils/api')
const {isString, isObject} = require('utils/object')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destination = path.resolve(`./${config.get('storage.path')}/tmp`)
    mkdirp(destination, cb.bind(this, null, destination))
  },
  filename: (req, file, cb) => {
    let fieldName = file.fieldname
    let fileName = `${fieldName}-${Date.now()}.${extension(file.originalname)}`
    cb(null, fileName)
  }
})

const handleUpload = ({fields, destination = 'other'}) => {
  let multerFields = Object.keys(fields).map(key => {
    let val = fields[key]
    return {
      name: key,
      maxCount: val.limit || 1
    }
  })
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      let acceptedTypes = fields[file.fieldname].type || []
      if (isString(acceptedTypes)) {
        acceptedTypes = [acceptedTypes]
      }
      if (acceptedTypes.length === 0) {
        throw new Error('Please specify accepted media types on handle upload middleware')
      }
      let type = file.mimetype.slice(0, file.mimetype.indexOf('/'))
      let isExtensionCorrect = mime.lookup(file.originalname) === file.mimetype
      let isOfAcceptedType = ~acceptedTypes.indexOf(type)

      if (isOfAcceptedType && isExtensionCorrect) {
        cb(null, true)
      } else {
        cb(null, false)
      }
    }
  }).fields(multerFields)

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (err) {
        console.log(err)
        res.status(500).send({error: true, message: 'File upload failed'})
      } else {
        const {body, files} = req
        let promises = []
        if (!isObject(files)) {
          return next()
        }
        Object.keys(files).forEach(key => {
          let fileField = files[key]
          let fieldInfo = fields[key]
          let type = (fieldInfo.limit && fieldInfo.limit > 1) ? 'array' : 'single'
          if (fileField && fileField.length > 0) {
            promises.push(processMulterFiles(
              fileField, type, key, destination
            ).then(result => {
              body[key] = result
              return Promise.resolve()
            }))
          }
        })
        Promise.all(promises)
          .then(() => {
            next()
          })
          .catch(err => {
            console.error(err)
            res.status(500).send(error({message: err.message}))
          })
      }
    })
  }
}

module.exports = handleUpload
