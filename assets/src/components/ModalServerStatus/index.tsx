import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Modal, Tooltip } from 'antd'
import styled from 'styled-components'
import { useAppSelector } from '../../redux'
import { hideServerModal } from '../../redux/serverStatus'
import ServerErrorImg from '../../img/serverError.gif'
import { iconMap } from '../../utils/iconMap'
import { notificationSuccess } from '../Notification'
import { RingLoader } from 'react-spinners'
import { primary } from '../../style/colors'

export const ModalServerStatus = () => {
  const dispatch = useDispatch()
  const { noConnection, error, msgError } = useAppSelector(
    ({ serverStatus }) => serverStatus
  )
  const title = noConnection
    ? 'Ooops! Problems connecting to server'
    : 'Ooops! There was a server error'

  const modalReload = () => {
    location.reload()
  }

  const handleHideClick = () => {
    dispatch(hideServerModal())
  }

  const handleImgClick = () => {
    if (error) {
      navigator.clipboard.writeText(msgError)
      notificationSuccess('Error message copied')
    }
  }

  return (
    <Modal
      title={[iconMap.warning, title]}
      visible={noConnection || error}
      closable={false}
      bodyStyle={{ height: '376px' }}
      footer={[
        <Button key="hide" onClick={() => handleHideClick()}>
          Hide
        </Button>,
        <Button key="reload" type="primary" onClick={modalReload}>
          Reload
        </Button>,
      ]}
    >
      <Tooltip title={msgError} placement="right">
        {!noConnection && (
          <StyledImg
            src={ServerErrorImg}
            alt="server status"
            onClick={handleImgClick}
          />
        )}
      </Tooltip>
      {noConnection && (
        <WrapperLoader>
          <RingLoader color={primary.main} size={250} />
        </WrapperLoader>
      )}
    </Modal>
  )
}

const StyledImg = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  width: auto;
`

const WrapperLoader = styled.div`
  height: 100%;
  top: 50vh;
  left: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
`
