import styled from 'styled-components'
import backgroundLogin from './login_bg.png'

export const LoginWrapper = styled.div`
  background-image: url(${backgroundLogin});
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  body {
    margin: unset !important;
    height: 100vh;
  }
`
