import React from 'react'
import { Modal } from 'antd'
import { iconMap } from '../../utils/iconMap'

interface ModalDeleteProps {
  open: boolean
  onCancel: () => void
  onOk: () => void
  description: string
}

export const ModalDelete = (p: ModalDeleteProps) => (
  <Modal
    title={[iconMap.warning, 'Sei sicuro di eliminare questo elemento?']}
    open={p.open}
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
