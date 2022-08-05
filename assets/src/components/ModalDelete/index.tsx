import React from 'react'
import { Modal } from 'antd'
import { iconMap } from '../../utils/iconMap'

interface ModalDeleteProps {
  visible: boolean
  onCancel: () => void
  onOk: () => void
  description: string
}

export const ModalDelete = (p: ModalDeleteProps) => (
  <Modal
    title={[iconMap.warning, 'Sei sicuro di eliminare questo elemento?']}
    visible={p.visible}
    okText="Elimina"
    okType="danger"
    okButtonProps={{ type: 'primary' }}
    cancelText="Annulla"
    onCancel={p.onCancel}
    onOk={p.onOk}
    cancelButtonProps={{
      style: { float: 'left' },
    }}
  >
    {p.description}
  </Modal>
)
