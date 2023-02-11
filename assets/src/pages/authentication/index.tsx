import React, { memo, useEffect, useState } from 'react'
import { Button, Form, Input, notification } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Footer } from '../../components/Footer'
import { MessageText } from '../../utils/messages'
import {
  BodyWrapper,
  FooterWrapper,
  FormWrapper,
  LogoWrapper,
  LogoStyled,
} from './index.style'
import { endpoints, fetchApi, MethodHTTP } from '../../services/api'
import Logo from '../../img/logo.png'
import 'antd/dist/reset.css'
import { clearPageContext, getPageContext } from '../../utils/pageContext'

const LoginPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const context = getPageContext()
  const logout = context?.logout || 0

  useEffect(() => {
    if (logout === 1) {
      notification.success({ message: MessageText.logoutSuccess })
      window.history.replaceState({}, document.title, '/login/')
      clearPageContext()
    }
  })

  const runLogin = () => {
    const username = form.getFieldValue('username')
    const password = form.getFieldValue('password')

    form.validateFields().then(() => {
      setLoading(true)
      fetchApi(endpoints.authentication.login, MethodHTTP.POST, {
        username,
        password,
      })
        .then((response: any) => {
          const { authError }: { authError: boolean } = response
          if (!authError) {
            const next =
              new URLSearchParams(window.location.search).get('next') || ''
            window.history.replaceState({}, document.title, next)
            window.location.pathname = next
            return
          }
          form.setFields([
            {
              name: 'username',
              errors: [MessageText.errorCredentials],
            },
            {
              name: 'password',
              errors: [MessageText.errorCredentials],
            },
          ])
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  return (
    <BodyWrapper>
      <FormWrapper>
        <LogoWrapper>
          <LogoStyled src={Logo} alt="Logo" />
          <span>CAPIRCI</span>
        </LogoWrapper>
        <Form
          form={form}
          onFinish={runLogin}
          size="large"
          initialValues={{
            username: 'operator1',
            password: 'Passwordoperator2',
          }} // TODO Remove default value
        >
          <Form.Item
            name="username"
            hasFeedback
            rules={[
              {
                required: true,
                message: MessageText.requiredField,
              },
            ]}
          >
            <Input placeholder="User" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="password"
            hasFeedback
            rules={[
              {
                required: true,
                message: MessageText.requiredField,
              },
            ]}
          >
            <Input.Password placeholder="Password" prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </FormWrapper>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </BodyWrapper>
  )
}

export default memo(LoginPage)
