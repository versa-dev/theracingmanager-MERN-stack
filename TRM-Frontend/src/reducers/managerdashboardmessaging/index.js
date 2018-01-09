import {
  SYNDICATE_MEMBERS,
  UPDATE_SYNDICATE_MEMBERS,
  MESSAGE_SEND_SUCCESS,
  MESSAGE_SEND_FAILED,
  SUBMITTING_MESSAGES
} from 'actions/managerdashboardmessaging'

import _ from 'lodash'

const initialState = {
  syndicateMembers: null,
  members: null,
  isPosting: false,
  resultMessage: ''
}

const reducer = (state = initialState, action) => {
  let newState = _.cloneDeep(state)
  switch (action.type) {
    case SYNDICATE_MEMBERS:
      newState.syndicateMembers = action.data
      return newState

    case UPDATE_SYNDICATE_MEMBERS:
      newState.members = action.data
      return newState

    case SUBMITTING_MESSAGES:
      newState.isPosting = true
      return newState

    case MESSAGE_SEND_SUCCESS:
      newState.resultMessage = 'success'
      newState.isPosting = false
      return newState

    case MESSAGE_SEND_FAILED:
      newState.resultMessage = action.error
      newState.isPosting = false
      return newState

    default:
      return state
  }
}

/**
 *  @name reducer
 */
export default reducer

