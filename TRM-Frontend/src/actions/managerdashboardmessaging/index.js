import {
  getSyndicateMembers,
  performSyndicateMemeberMessageUpdate
} from 'api/Services'

export const UPDATE_SYNDICATE_MEMBERS = 'UPDATE_SYNDICATE_MEMBERS'

export const MESSAGE_SEND_SUCCESS = 'MESSAGE_SEND_SUCCESS'

export const MESSAGE_SEND_FAILED = 'MESSAGE_SEND_FAILED'

export const SUBMITTING_MESSAGES = 'SUBMITTING_MESSAGES'

export const SYNDICATE_MEMBERS = 'SYNDICATE_MEMBERS'

export const updateMessageSyndicateMember = (data) => ({
  type: UPDATE_SYNDICATE_MEMBERS,
  data
})

export const submittingMessage = () => ({
  type: SUBMITTING_MESSAGES
})

export const messageSendSuccess = () => ({
  type: MESSAGE_SEND_SUCCESS
})

export const messageSendFailed = (error) => ({
  type: MESSAGE_SEND_FAILED,
  error
})

export const gotSyndicateMembers = (data) => ({
  type: SYNDICATE_MEMBERS,
  data
})

export const getSyndicateMember = (token, slug) => {
  return (dispatch, getState) => {

    return getSyndicateMembers(token, slug)
    .then((data) => {
      dispatch(gotSyndicateMembers(data))
      return Promise.resolve(data)
    })
    .catch((error) => {
      dispatch(messageSendFailed(error))
      return Promise.reject(error)
    })
  }
}

export const syndiCateMemberMessagesPost = (data, token, slug) => {
  return (dispatch, getState) => {
    dispatch(submittingMessage)

    return performSyndicateMemeberMessageUpdate(data, token, slug)
    .then(() => {
      dispatch(messageSendSuccess())
      return Promise.resolve(data)
    })
    .catch((error) => {
      dispatch(messageSendFailed(error))
      return Promise.reject(error)
    })
  }
}