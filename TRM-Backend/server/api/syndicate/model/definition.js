const {
  PRIMARY_COLOR,
  DESCRIPTION,
  AVAILABILITY,
  BENEFITS,
  HERITAGE,
  TRAINERS_HEADLINE,
  TRAINERS_TEXT,
  HORSES_HEADLINE,
  HORSES_TEXT
} = require('./constants')

module.exports = {
  name: {
    type: String,
    uppercase: true,
    required: true,
    unique: true
  },
  addressLine1: {
    type: String
  },
  addressLine2: {
    type: String
  },
  addressCounty: {
    type: String
  },
  addressCountry: {
    type: String
  },
  addressPostcode: {
    type: String
  },
  cardId: {
    type: String
  },
  type: {
    type: String
  },
  ownership: {
    type: String
  },
  maxMembers: {
    type: Number
  },
  featuredImage: {
    type: String,
    file: true,
    default: '/assets/placeholder/featuredImage.jpg'
  },
  logoImage: {
    type: String,
    file: true
  },
  owner: {
    firstname: {
      type: String
    },
    surname: {
      type: String
    },
    email: {
      type: String
    }
  },
  description: DESCRIPTION,
  availability: AVAILABILITY,
  benefits: BENEFITS,
  heritage: HERITAGE,
  trainersHeadline: TRAINERS_HEADLINE,
  trainersText: TRAINERS_TEXT,
  horsesHeadline: HORSES_HEADLINE,
  horsesText: HORSES_TEXT,
  color: {
    type: String
  },
  mainColor: {
    body: {
      type: String
    },
    sleeves: {
      type: String
    },
    cap: {
      type: String
    }
  },
  primaryColor: {
    type: String,
    enum: PRIMARY_COLOR
  },
  approved: {
    type: Number
  },
  bhaApproved: {
    type: Boolean,
    default: false
  },
  newSyndicate: {
    type: Boolean,
    default: true
  }
}
