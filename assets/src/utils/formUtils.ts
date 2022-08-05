import { FormInstance } from 'antd'
import styled from 'styled-components'
import { notificationError } from '../components/Notification'
import { MessageText } from './messages'

export const setFieldError = (err: Error, form: FormInstance) => {
  const fieldErrorName = err.message.split(':')[0]
  const fieldErrorMessage = err.message.split(':')[1]
  form.setFields([
    {
      name: fieldErrorName,
      errors: [fieldErrorMessage],
    },
  ])
  notificationError(MessageText.invalidForm)
}

export const WrapperPageForm = styled.div`
  padding: 0 24px;
`

export const validateMessages = {
  required: MessageText.requiredField,
  types: {
    email: MessageText.emailNotValid,
  },
}
