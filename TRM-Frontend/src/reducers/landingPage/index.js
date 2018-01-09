import {
  NAME_TEXT_UPDATE,
  EMAIL_TEXT_UPDATE,
  SELECTED_ITEM_UPDATE,
  UPDATE_MESSAGE_TEXT,
  SUCCEED_SUBMIT_FORM,
  FAILED_SUBMIT_FORM
} from 'actions/landingpage'

import update from 'immutability-helper'

import _ from 'lodash'

/**
 * @name initialState
 *  @type { object }
 *  @description - Initial state
 */
const initialState = {
  name: '',
  email: '',
  subject: '',
  message: '',
  resultMessage: ''
}

/**
 *  @name reducer
 *  @type { function }
 *  @param { object } state
 *  @param { object } action
 *  @return { object }
 */
const reducer = (state = initialState, action) => {
  let newState = _.cloneDeep(state)
  /**
   *  @type { switch }
   *  @return { object }
   */
  switch (action.type) {
    case NAME_TEXT_UPDATE:
      newState.name = action.data
      return newState

    case EMAIL_TEXT_UPDATE:
      newState.email = action.data
      return newState

    case SELECTED_ITEM_UPDATE:
      newState.subject = action.data
      return newState

    case UPDATE_MESSAGE_TEXT:
      newState.message = action.data
      return newState

    case SUCCEED_SUBMIT_FORM:
      newState.resultMessage = 'success'
      return newState

    case FAILED_SUBMIT_FORM:
      newState.resultMessage = 'failed'
      return newState

    default:
      return state
  }
}

/**
 *  @name reducer
 */
export default reducer

