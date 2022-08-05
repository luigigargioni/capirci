import { Button } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { iconMap } from '../../utils/iconMap'
import { ActionType } from '../Functionbar/Functionbar'

interface TitleBarProps {
  action: ActionType
  modifica: () => void
  inserisci: () => void
  modificaDescr: string
  inserisciDescr: string
}

export const TitleBar = (p: TitleBarProps) => {
  const space: string = '  '

  return (
    <>
      <WrapperTitleBar>
        <ButtonTitleBar
          type="primary"
          onClick={p.action === ActionType.EDIT ? p.modifica : p.inserisci}
        >
          Salva
        </ButtonTitleBar>
        <StyledTitle>
          {p.action === ActionType.INSERT && [
            iconMap.insert,
            `${space}${p.inserisciDescr}`,
          ]}
          {p.action === ActionType.EDIT && [
            iconMap.edit,
            `${space}${p.modificaDescr}`,
          ]}
        </StyledTitle>
      </WrapperTitleBar>
      <hr />
    </>
  )
}

const WrapperTitleBar = styled.div`
  margin-top: 10px;
  margin-bottom: -10px;
`

const ButtonTitleBar = styled(Button)`
  float: right;
  margin-right: 10px;
`

const StyledTitle = styled.p`
  text-align: center;
  font-size: 16pt;
  color: ${(p) => p.theme.colors.primary.main};
`
