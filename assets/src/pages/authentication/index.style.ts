import styled from 'styled-components'
import backgroundLogin from '../../img/backgroundLogin.png'
import SVG from 'react-inlinesvg'

export const FooterWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
`

export const BodyWrapper = styled.div`
  background-image: url(${backgroundLogin});
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`

export const FormWrapper = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  margin: -160px 0 0 -160px;
  width: 320px;
  height: 280px;
  padding: 28px;
  vertical-align: middle;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5%;
  box-shadow: 0 0 100px rgba(0, 0, 0, 0.08);

  p {
    color: rgb(204, 204, 204);
    text-align: center;
    margin-top: 16px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
  }
`

export const LogoStyled = styled.img`
  width: 40px;
  height: auto;
  margin-right: 8px;
`

export const LogoWrapper = styled.div`
  text-align: center;
  cursor: default;
  margin-bottom: 18px;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    vertical-align: text-bottom;
    font-size: 16px;
    text-transform: uppercase;
    display: inline-block;
    font-weight: 700;
    color: ${(p) => p.theme.colors.primary.main};
  }
`
