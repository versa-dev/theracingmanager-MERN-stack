import React, { PureComponent } from 'react'

import PropTypes from 'prop-types'

import Input from 'components/input/Input'

import Select from 'components/input/Select'

import TextArea from 'components/input/TextArea'

import { Form, Field, Submit } from 'components/forms/BaseForm'

import TextButton from 'components/buttons/TextButton'

import {
  NAME,
  EMAIL,
  SUBJECT,
  MESSAGE
} from 'texts/forms'

class RegisterExistingSyndicateForm extends PureComponent {
  constructor (props) {
    super(props)
  }

  render () {
    const { submitForm, values, canProgress } = this.props
    return (
      <div className="register-existing-syndicate-form">
        <Form
          handleSubmit={() => { submitForm(values) }}
          {...this.props}>
          <div className="form__group">
            <Field
              component={Input}
              placeholder={NAME}
              validate={['name']}
              name='name' />
          </div>

          <div className="form__group">
            <Field
              component={Input}
              placeholder={EMAIL}
              validate={['email']}
              name='email' />
          </div>

          <div className="form__group">
            <Field
              component={Select}
              placeholder={SUBJECT}
              validate={['subject']}
              name='subject' />
          </div>

          <div className="form__group">
            <Field
              component={TextArea}
              placeholder={MESSAGE}
              validate={['message']}
              name='message' />
          </div>

          <Submit component={(props) => TextButton({
            ...props,
            text: 'SEND',
            modifier: 'secondary',
            isDisabled: !canProgress
          })} />
        </Form>
      </div>
    )
  }
}

RegisterExistingSyndicateForm.propTypes = {
  submitForm: PropTypes.func,
  values: PropTypes.object
}

export default RegisterExistingSyndicateForm

