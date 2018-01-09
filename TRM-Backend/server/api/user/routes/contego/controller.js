// const User = require('api/user/model')
const randomString = require('randomstring')
// const fse = require('fs-extra')
const rp = require('request-promise')
const UserController = require('api/user/controller')
const User = require('api/user/model')
const {sendMail} = require('utils/email')

// TODO: Store the below consts in wherever the API constants are stored
const MAX_WAITING_USERS_UPDATE = 10

let getByContegoReference = reference => {
  return new Promise((resolve, reject) => {
    UserController.findOne({'contego.reference': reference}).then((user) => {
      resolve(user)
    }).catch(err => {
      reject(err)
    })
  })
}// f

let prepareCheckPayload = (firstName, lastName, dob, gender, address, postcode, passportImage, ref) => {
  return {
    'checkCompany': null,
    'checkPerson': {
      'person': {
        // 'dob': dob,
        'passport': {
          'forename': firstName,
          'uploadedFile': [
            {
              'fileType': 'JPG',
              'fileContent': passportImage,
              'fileName': 'passport-photo.jpg'
            }
          ]
        },
        'nationalIDCard': {
          'uploadedFile': []
        },
        'visa': {
          'uploadedFile': []
        }
      }
    },
    'checkTransaction': null,
    'credentials': {
      'organisationUID': process.env.CONTEGO_ORGUID,
      'profileUID':  process.env.CONTEGO_PROFUID,
      'md5Signature': process.env.CONTEGO_MD5
    },
    'header': {
      'transactionRef': 'TransactionRef_' + ref
    }
  }
}// f

let prepareRefreshPayload = (requestRef) => {
  return {
    'credentials': {
      'organisationUID': process.env.CONTEGO_ORGUID,
      // 'profileUID': 'd83b8f54-f2f5-441c-956f-8e7cbfc40f1c',
      'md5Signature': process.env.CONTEGO_MD5
    },
    'checkInfo': {'requestRef': requestRef}
  }
}// f

let mailUpdatesAboutUsers = (updatedArr) => {
  sendMail({
    to: 'piotr@vitaminlondon.com', // TODO: swap for admin email
    subject: `The contego status available for ${updatedArr.length} users`,
    template: {
      name: 'contegoStatusUpdate',
      data: {people: updatedArr}
    }
  })
}// f

let prepareOptions = (payload, path) => {
  return {
    method: 'POST',
    uri: 'https://secure.contego.com/rest/' + path,
    body: JSON.stringify(payload),
    headers: {'Content-Type': 'application/json; charset=utf-8'}
  }
}// f

let getQueue2Update = (max = MAX_WAITING_USERS_UPDATE) => {
  return User.find({'contego.status': {$eq: 'WAITING'}})
    .then(res => res.sort((a, b) => {
      return b.contego.lastChecked - a.contego.lastChecked
    }).slice(-1 * max))
}// f

let makeUpdates4Arr = userArr => {
  let count = 0
  let people = []

  return new Promise((resolve, reject) => {
    if (userArr.length < 1) return resolve([])
    userArr.forEach((value, index) => {
      return rp(prepareOptions(prepareRefreshPayload(value.contego.requestRef), 'getresponse'))
        .then(res => JSON.parse(res))
        .then(res => res.contegoResponse.contegoScore.rag || null)
        .then(flag => {
          // prep for update
          let contego = value.contego
          contego.status = flag
          contego.lastChecked = Date.now()
          value.flag = flag

          // perform updates
          return User.findOneAndUpdate({_id: value._id}, {$set: {contego: contego}})
        })
        .then(() => {
          count++

          if (value.flag !== 'WAITING') {
            people.push({
              username: value.username,
              email: value.email,
              firstname: value.firstname,
              surname: value.surname,
              status: value.flag
            })
          }

          console.log(count)
          if (count === userArr.length) {
            resolve(people)
          }
        })
        .catch(err => {
          console.log(err)
          reject(false)
        })
    })
  })
}// f

const updateWaiting = () => {
  return getQueue2Update()
    .then(list => makeUpdates4Arr(list))
    .then(people => {
      console.log(people)
      if (people.length) {
        mailUpdatesAboutUsers(people)
      }
      return Promise.resolve({message: 'update script exits successfully'})
    }).catch((err) => console.log(err))
}// f

const contegoVerify = (body, {user}) => {
  // const {firstName, lastName, gender, dob, address, postcode, passportImage} = body
  // check if contego check performed earlier
  if (user.contego.reference) {
    return Promise.resolve({message: 'Contego check performed before'})
  }

  // TODO: validate incoming data

  // create a contego reference with good entropy
  if (!user.contego.reference) {
    user.contego = {
      reference: randomString.generate(12),
      status: 'WAITING',
      result: null,
      lastChecked: Date.now()
    }
  }

  // get user by the reference
  return getByContegoReference(user.contego.reference)
    // then: see if user was matched
    .then(matchedUser => {
      if (matchedUser) {
        return Promise.reject({message: 'This reference already exists'})
      }
      return user
    }).catch(err => {
      console.log(err)
      Promise.reject({message: 'Database fetch error'})
    // then: save the file to temp storage
    }).then((user) => {
      /* return fse.outputFile(
        `uploads/tmp/${user.contego.reference}.jpg`,
        new Buffer(passportImage, 'base64')
      ) */
    // then: make a contego call
    }).then(() => {
      let ref = user.contego.reference
      let {firstName, lastName, dob, gender, address, postcode, passportImage} = body
      return rp(prepareOptions(prepareCheckPayload(
        firstName, lastName, dob, gender, address, postcode, passportImage, ref
      ), 'check'))
      // then: modify the result to save if the response came immediately
    }).then(res => JSON.parse(res))
    .then(res => {
      user.contego.requestRef = res.header.requestRef
      return user.save()
      // then: respond to FE client
    }).then(() => Promise.resolve({message: 'Contego check submitted'}))
}// f

module.exports = {
  contegoVerify,
  updateWaiting
}
