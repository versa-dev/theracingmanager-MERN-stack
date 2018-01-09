const path = require('path')
const fs = require('fs-extra')

const exec = require('child_process').exec

const fileUtils = {
  removeFile: (filePath) => {
    let fullPath = path.resolve(`./${filePath}`)
    let baseDir = path.dirname(fullPath)
    fs.pathExists(fullPath)
      .then(exists => {
        if (exists) {
          return fs.remove(fullPath)
        } else return Promise.reject(new Error(`Path does not exist: ${fullPath}`))
      })
      .then(() => {
        return fs.readdir(baseDir)
      })
      .then(res => {
        console.log(`Removed: ${fullPath}`)
        if (res.length === 0) {
          return fs.remove(baseDir)
        }
        return Promise.resolve()
      })
      .catch(err => {
        console.log(err.message)
      })
  },

  extension: (name) => {
    return name.slice(name.lastIndexOf('.') + 1)
  },

  generateThumbnail: (file) => {
    return new Promise((resolve, reject) => {
      let thumbnailPath = `${path.dirname(file)}/${path.basename(file, path.extname(file))}.jpg`
      const command = `ffmpeg -ss 00:00:00 -i ${file} -y -vframes 1 -f image2 ${thumbnailPath}`
      exec(command, err => {
        if (err) {
          reject(err)
        } else {
          resolve(thumbnailPath)
        }
      })
    })
  }
}

module.exports = fileUtils
