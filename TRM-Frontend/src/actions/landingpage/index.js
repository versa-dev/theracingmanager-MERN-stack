import { performLandingPage } from 'api/Services'

export const NAME_TEXT_UPDATE = 'NAME_TEXT_UPDATE'

export const EMAIL_TEXT_UPDATE = 'EMAIL_TEXT_UPDATE'

export const UPDATE_MESSAGE_TEXT = 'UPDATE_MESSAGE_TEXT'

export const SELECTED_ITEM_UPDATE = 'SELECTED_ITEM_UPDATE'

export const SUCCEED_SUBMIT_FORM = 'SUCCEED_SUBMIT_FORM'

export const FAILED_SUBMIT_FORM = 'FAILED_SUBMIT_FORM'

export const inputNameChange = (data) => ({
  type: NAME_TEXT_UPDATE,
  data
})

export const inputEmailChange = (data) => ({
  type: EMAIL_TEXT_UPDATE,
  data
})

export const selectedItemUpdate = (data) => ({
  type: SELECTED_ITEM_UPDATE,
  data
})

export const updateMessageText = (data) => ({
  type: UPDATE_MESSAGE_TEXT,
  data
})

export const SucceedSubmitForm = () => ({
  type: SUCCEED_SUBMIT_FORM
})

export const failedToSubmitForm = (error) => ({
  type: FAILED_SUBMIT_FORM,
  error
})

export const onSubmitData = (data, token) => {
  return (dispatch, getState) => {

    return performLandingPage(data, token)
    .then(() => {
      dispatch(SucceedSubmitForm())
      return Promise.resolve(data)
    })
    .catch((error) => {
      dispatch(failedToSubmitForm(error))
      return Promise.reject(error)
    })
  }
}
