const created = name => (`${name} has been created`)
const notFound = type => name => (`Could not find ${type} '${name}'`)

module.exports = {
  METHODS: {
    HORSE: {
      NOT_FOUND: notFound('horse')
    },
    USER: {
      NOT_FOUND: notFound('user')
    },
    MISSING_PARAMETER: param => (`Please provide ${param}.`)
  },
  GENERIC: {
    NOT_FOUND: 'Not found',
    FAILED: 'Failed',
    EMPTY: 'Empty sources'
  },
  CHANGEPASSWORD: {
    SUCCESS: 'Changed password successfully',
    ERROR: {
      EMPTY_PARAM: 'Provide oldPassword and newPassword',
      NOT_FOUND: notFound('user')
    }
  },
  CONTACTDETAILS: {
    VERIFY: 'Please check your email inbox to verify your account',
    SUCCESS: 'Updated profile successfully',
    ERROR: {
      EMPTY_PARAM: 'Provide email and phoneNumber',
      NOT_FOUND: 'notFound'
    }
  },
  FORGOTTEN: {
    SUCCESS: 'Your request has been sent successfully',
    ERROR: {
      EMPTY_PARAM: 'Provide email address',
      NOT_FOUND: 'Not Found'
    }
  },
  RESETPASSWORD: {
    SUCCESS: 'Your password has been reset',
    ERROR: 'Not Found'
  },
  VERIFICATION: {
    ERROR: 'Please verify your account'
  },
  AUTHENTICATION: {
    ERROR: 'Login failed',
    SUCCESS: 'Login successful',
    DEACTIVE: 'Please activate your account before login'
  },
  REGISTER: {
    SUCCESS: created('User')
  },
  EMAIL: {
    DUPLICATE: 'This email has been taken',
    ERROR: 'Please provide email with correct format'
  },
  FIRSTNAME: {
    REQUIRED: 'Please provide your first name',
    ERROR: 'Please enter a valid name; It can contain capital letters, hyphens and a min 2 characters'
  },
  MESSAGE: {
    SUCCESS: created('Message')
  },
  COMMENT: {
    SUCCESS: created('Comment')
  },
  SYNDICATE: {
    ERROR: {
      NOT_FOUND: notFound('syndicate')
    }
  },
  SOURCE: {
    TOKEN: 'Please provide token',
    REQUIRED: 'Please provide source id'
  }
}
