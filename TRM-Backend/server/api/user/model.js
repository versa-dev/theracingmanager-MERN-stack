const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema.Types
const {EMAIL_VLD, PASSWORD_VLD, FIRSTNAME_VLD} = require('utils/validation')
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator')
const {AUTHENTICATION} = require('data/messages')
const {removeFilesOnUpdate} = require('utils/mongoose')
const {isMongoId} = require('utils/object')

let UserModel

let userDefinition = {
  active: {
    type: Boolean,
    default: true
  },
  firstname: FIRSTNAME_VLD,
  surname: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  username: {
    type: String,
    validate: {
      isAsync: true,
      validator: function (value, done) {
        if (this.isModified('username') || this.isNew) {
          UserModel.findOne(
            {username: value}
          ).then(user => {
            if (user) {
              done(false)
            } else {
              done(true)
            }
          }).catch(err => {
            console.error(err)
            done(false)
          })
        } else {
          done(true)
        }
      },
      message: `This username has been taken`
    }
  },
  verification: {
    type: String
  },
  avatarImage: {
    type: String,
    file: true
  },
  birthDate: {
    type: Date
  },
  email: EMAIL_VLD,
  password: PASSWORD_VLD,
  type: {
    type: String,
    lowercase: true
  },
  isContentManager: {
    type: Boolean,
    default: false
  },
  location: {
    type: String
  },
  address1: {
    type: String
  },
  address2: {
    type: String
  },
  postCode: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  syndicates: [{
    _id: {
      type: ObjectId,
      ref: 'Syndicate'
    },
    role: {
      type: String
    }
  }],
  dynHandle: {
    type: String
  },
  ownership: [{
    _id: false,
    horse: {
      type: ObjectId,
      ref: 'Horse'
    },
    shares: {
      type: Number
    }
  }],
  deviceType: {
    type: String
  },
  deviceToken: {
    type: String
  },
  contego: {
    reference: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        isAsync: true,
        validator: function (value, done) {
          if (this.isModified('contego.reference') || this.isNew) {
            UserModel.findOne(
              {'contego.reference': value}
            ).then(user => {
              if (user) {
                done(false)
              } else {
                done(true)
              }
            }).catch(err => {
              console.error(err)
              done(false)
            })
          } else {
            done(true)
          }
        },
        message: `This contego reference is in use`
      }
    },
    status: {
      type: String
    },
    result: {
      type: Number
    },
    lastChecked: {
      type: Date
    },
    requestRef: {
      type: String
    }
  },
  billings: {
    feeInfos: {
      ownershipType: {
        type: String,
        default: 'Fixed period'
      },
      kindOfFees: {
        type: String,
        default: 'One of all inclusive'
      },
      initialFee: {
        type: Number,
        default: 0
      },
      monthlyFee: {
        type: Number,
        default: 0
      },
      expireDate: {
        type: String,
        default: null
      }
    },
    customer: {
      type: String
    },
    invoice: {
      type: Array
    }
  },
  notifyOptions: {
    email: {
      type: Boolean,
      default: true
    },
    text: {
      type: Boolean,
      default: false
    },
    apple: {
      type: Boolean,
      default: false
    }
  }
}

const UserSchema = new Schema(userDefinition)

UserSchema.plugin(uniqueValidator)
UserSchema.plugin(removeFilesOnUpdate, {
  definition: userDefinition
})

// Hash the user's password before inserting a new user
UserSchema.pre('save', function (next) {
  let user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err)
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err)
        }
        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

// Compare password input to password saved in database
UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password)
    .then(isMatch => {
      if (isMatch) {
        return Promise.resolve()
      }
      return Promise.reject({message: AUTHENTICATION.ERROR})
    })
    .catch(() => {
      return Promise.reject({message: AUTHENTICATION.ERROR})
    })
}

// Validate if contego reference has been used before
UserSchema.methods.validateContegoReference = function (reference) {
  if (reference) {
    return Promise.resolve()
  }
  return Promise.reject({message: AUTHENTICATION.ERROR})
}

UserSchema.methods.addShare = function ({horse, amount = 1}) {
  let owned = this.ownership.filter(o => (o.horse.toString() === horse._id.toString()))
  if (owned.length > 0) {
    owned[0].shares.owned += 1
  } else {
    this.ownership.push({
      horse: horse._id,
      shares: {
        owned: amount,
        total: horse.shares.total
      }
    })
  }
}

UserSchema.methods.getUserRole = function (syndicateId) {
  let role = 'empty'
  if (isMongoId(syndicateId) && this.syndicates.filter(s => { return s._id.toString() === syndicateId.toString() }).length > 0) {
    role = this.syndicates.filter(s => { return s._id.toString() === syndicateId.toString() })[0].role
  }

  return role
}

UserSchema.methods.ownsHorse = function (horseId) {
  return isMongoId(horseId) && this.ownership.filter(e => (e.horse.toString() === horseId.toString())).length > 0
}

UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel
