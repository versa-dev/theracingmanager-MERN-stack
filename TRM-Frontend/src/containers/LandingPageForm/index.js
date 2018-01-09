import React, { PureComponent } from 'react'

import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import Input from 'components/input/Input'

import SortSelect, { Option } from 'components/searchandfilter/SortSelect'

import TextButton from 'components/buttons/TextButton'

import TextArea from 'components/input/TextArea'

import { getItem } from 'utils/storageutils'

import { USER_TOKEN } from 'data/consts'

import {
  NAME,
  EMAIL,
  SUBJECT,
  MESSAGE
} from 'texts/forms'

import {
  inputNameChange,
  inputEmailChange,
  selectedItemUpdate,
  updateMessageText,
  onSubmitData
} from 'actions/landingpage'

let token = getItem(USER_TOKEN)

class LandingPageFormContainer extends PureComponent {
  constructor () {
    super()

    this.onChangeName = this.onChangeName.bind(this)
    this.onChangeEmail = this.onChangeEmail.bind(this)
    this.updateFeedText = this.updateFeedText.bind(this)
    this.onSelectUpdate = this.onSelectUpdate.bind(this)
    this.onSubmitData = this.onSubmitData.bind(this)
  }

  onChangeName (e) {
    this.props.inputNameChange(e.currentTarget.value)
  }

  onChangeEmail (e) {
    this.props.inputEmailChange(e.currentTarget.value)
  }

  updateFeedText (text) {
    this.props.updateText(text)
  }

  onSelectUpdate (selectedItem) {
    this.props.selectedItemUpdate(selectedItem)
  }

  onSubmitData () {
    let data = { name: this.props.name, email: this.props.email, subject: this.props.subject, message: this.props.message }
    this.props.onSubmitData(data, token)
  }

  render () {
    return (
      <div className="landing-page-form">
        <div className="name">
          <Input
            placeholder={NAME}
            handleChange={(e) => { this.onChangeName(e) }}
            value={this.props.name} />
        </div>

        <div className="email">
          <Input
            placeholder={EMAIL}
            handleChange={(e) => { this.onChangeEmail(e) }}
            value={this.props.email} />
        </div>

        <div className="subject">
          <SortSelect
            onChange={(e) => { this.onSelectUpdate(e) }}
            defaultValue={`Joining a syndicate`}
            placeholder={SUBJECT}>
            <Option key="Joining a syndicate" value="Joining a syndicate">Joining a syndicate</Option>
            <Option key="Registering a syndicate" value="Registering a syndicate">Registering a syndicate</Option>
            <Option key="My account & Billing" value="My account & Billing">My account & Billing</Option>
            <Option key="Mobile app" value="Mobile app">Mobile app</Option>
            <Option key="VAT & Invoicing" value="VAT & Invoicing">VAT & Invoicing</Option>
            <Option key="Other" value="Other">Other</Option>
          </SortSelect>
        </div>

        <div className="message">
          <TextArea
            ref='textarea'
            maxLength={500}
            minHeight={100}
            name='feed-submit-textarea'
            className='feed-submit__textarea-container'
            handleChange={(e) => { this.updateFeedText(e.target.value) }}
            value={this.props.message}
            placeholder={MESSAGE}
            markdown={true}/>
        </div>
        <div className="submit">
          <TextButton
            text='SEND'
            modifier='secondary'
            className='landing-page__more-btn'
            onClick={() => this.onSubmitData()}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    landingPage
  } = state

  const {
    name,
    email,
    subject,
    message
  } = landingPage

  return {
    name,
    email,
    subject,
    message
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    inputNameChange: (data) => {
      return dispatch(inputNameChange(data))
    },
    inputEmailChange: (data) => {
      return dispatch(inputEmailChange(data))
    },
    selectedItemUpdate: (data) => {
      return dispatch(selectedItemUpdate(data))
    },
    updateText: (text) => {
      return dispatch(updateMessageText(text))
    },
    onSubmitData: (data, token) => {
      return dispatch(onSubmitData(data, token))
    }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingPageFormContainer))
