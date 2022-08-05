import React from 'react'
import { Spin } from 'antd'
import styled from 'styled-components'

export const LoadingSpinner = () => (
  <StyledSpin size="large" tip="Caricamento..." />
)

const StyledSpin = styled(Spin)`
  position: fixed;
  top: 50%;
  left: 50%;

  .ant-spin-text {
    font-size: large;
  }
`
