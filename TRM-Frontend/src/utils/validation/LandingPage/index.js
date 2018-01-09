/**
 *  @module validateTypes
 */
import * as VALIDATE from 'utils/validation/ValidationTypes'

/**
 *  @module errorMessages
 */
import * as ERROR from 'texts/errormessages'

/**
 *  personalInformationValidators
 *  @param  {String} type
 *  @param  {Object} formValues
 *  @return {Array}
 */
export const landingPageValidators = (type, formValues = {}) => {
  /**
   *  @const
   */
  const {
    name,
    email,
    subject,
    message,
  } = formValues

  switch (type) {
    case 'name':
      return VALIDATE.NAME(name) ? [] : [ERROR.FIRST_NAME]

    case 'email':
      return VALIDATE.EMAIL(email) ? [] : [ERROR.EMAIL]

    case 'subject':
      return VALIDATE.REQUIRED(subject) ? [] : [ERROR.REQUIRED]

    case 'message':
      return VALIDATE.REQUIRED(message) ? [] : [ERROR.REQUIRED]

    default:
      return []
  }
}

