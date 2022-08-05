import { Modal } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { iconMap } from '../../utils/iconMap'
import { ActionType } from '../Functionbar/Functionbar'

interface CustomModalProps {
  title: string
  visible: boolean
  hideModal: () => void
  handleOk: () => void
  children?: JSX.Element | JSX.Element[]
  action?: ActionType
  okText?: string
  getContainer?: () => HTMLElement
  fullPage?: boolean
}

export const CustomModal = (p: CustomModalProps) => {
  const space = '  '
  const icon = p.action === ActionType.EDIT ? iconMap.edit : iconMap.insert
  const title = p.action ? [icon, `${space}${p.title}`] : p.title
  const fullPage = p.fullPage || true

  return (
    <StyledModal
      title={title}
      centered
      visible={p.visible}
      onOk={() => p.handleOk()}
      okText={p.okText || 'Salva'}
      onCancel={() => p.hideModal()}
      cancelText="Annulla"
      okButtonProps={{
        size: 'large',
      }}
      cancelButtonProps={{
        size: 'large',
        style: { float: 'left' },
      }}
      maskClosable={false}
      destroyOnClose
      width={fullPage ? '98%' : undefined}
      bodyStyle={fullPage ? { height: '79vh', overflow: 'auto' } : undefined}
      getContainer={p.getContainer}
    >
      {p.children}
    </StyledModal>
  )
}

const StyledModal = styled(Modal)`
  .ant-modal-title {
    color: ${(p) => p.theme.colors.primary.main};
    font-size: x-large;
    text-align: center;
  }
`

export const WrapperPage = styled.div`
  height: 100%;

  .ant-modal-mask,
  .ant-modal-wrap {
    position: absolute;
  }
`
