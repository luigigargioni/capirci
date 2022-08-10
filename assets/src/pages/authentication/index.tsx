import React, { memo, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Form, Input, notification } from 'antd'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
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
import { endpoints, MethodHTTP } from '../../services/api'
import Logo from '../../img/logo.png'
import 'antd/dist/antd.css'
import { setServerError, setServerNoConnection } from '../../redux/serverStatus'
import { ModalServerStatus } from '../../components/ModalServerStatus'
import { clearPageContext, getPageContext } from '../../utils/pageContext'

const LoginPage = () => {
  const dispatch = useDispatch()
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

  const copyrightStartYear = 2022
  const copyrightEndYear =
    new Date().getFullYear() === copyrightStartYear
      ? ''
      : `-${new Date().getFullYear()}`

  const runLogin = () => {
    const username = form.getFieldValue('username')
    const password = form.getFieldValue('password')

    form.validateFields().then(() => {
      setLoading(true)
      const options: AxiosRequestConfig = {
        url: endpoints.authentication.login,
        method: MethodHTTP.POST,
        data: {
          username,
          password,
        },
      }
      axios(options)
        .then((response: AxiosResponse) => response.data)
        .then((response: any) => {
          const { authError }: { authError: boolean } = response
          if (!authError) {
            window.location.pathname = ''
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
        .catch((error: AxiosError<any>) => {
          console.log(error)
          if (error.response) {
            switch (error.response.status) {
              case 0:
                dispatch(setServerNoConnection())
                break
              case 500:
                dispatch(setServerError(error.response.data.message))
                break
              default:
                dispatch(setServerError(error.response.data.message))
            }
          }
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  return (
    <>
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
              <Input placeholder="Utente" prefix={<UserOutlined />} />
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
              <Input.Password
                placeholder="Password"
                prefix={<LockOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Accedi
              </Button>
            </Form.Item>
          </Form>
        </FormWrapper>
        <FooterWrapper>
          <Footer
            copyright={`CAPIRCI ©${copyrightStartYear}${copyrightEndYear} Luigi Gargioni`}
          />
        </FooterWrapper>
      </BodyWrapper>
      <ModalServerStatus />
    </>
  )
}

export default memo(LoginPage)
