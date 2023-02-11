import React, { ReactElement } from 'react'
import { Button, Tooltip } from 'antd'
import { FunctionbarWrapper } from './Functionbar.style'
import { iconMap } from '../../utils/iconMap'
import { ModalDelete } from '../ModalDelete'

export enum ActionType {
  EDIT = 'edit',
  INSERT = 'insert',
  DELETE = 'delete',
}

interface FunctionbarProps {
  children?: ReactElement | ReactElement[]
  CRUD?: {
    onEdit?: () => void
    onInsert?: () => void
    onDelete?: () => void
    modalDelete?: {
      description?: string
      onOk: () => void
      modalDeleteVisible: boolean
      setModalDeleteVisible: (visible: boolean) => void
    }
    disableButton?: boolean
  }
  onRefresh?: () => void
}

export const Functionbar = (p: FunctionbarProps) => {
  const disableButton = p.CRUD?.disableButton || false

  return (
    <FunctionbarWrapper>
      {p.CRUD && (
        <>
          {p.CRUD.onEdit && (
            <Tooltip title="Modifica" placement="bottom">
              <Button
                shape="round"
                icon={iconMap.edit}
                disabled={disableButton}
                onClick={p.CRUD.onEdit}
              />
            </Tooltip>
          )}
          {p.CRUD.onInsert && (
            <Tooltip title="Inserisci" placement="bottom">
              <Button
                shape="round"
                icon={iconMap.insert}
                onClick={p.CRUD.onInsert}
              />
            </Tooltip>
          )}
          {p.CRUD.onDelete && (
            <Tooltip title="Elimina" placement="bottom">
              <Button
                shape="round"
                icon={iconMap.delete}
                disabled={disableButton}
                onClick={p.CRUD.onDelete}
              />
            </Tooltip>
          )}
        </>
      )}
      {p.children}
      {p.CRUD?.modalDelete && (
        <ModalDelete
          onOk={p.CRUD.modalDelete.onOk}
          onCancel={() => p.CRUD?.modalDelete?.setModalDeleteVisible(false)}
          open={p.CRUD.modalDelete.modalDeleteVisible}
          description={p.CRUD.modalDelete.description || ''}
        />
      )}
      {p.onRefresh && (
        <Tooltip title="Ricarica">
          <Button
            shape="round"
            icon={iconMap.refresh}
            onClick={p.onRefresh}
            style={{ float: 'right' }}
          />
        </Tooltip>
      )}
    </FunctionbarWrapper>
  )
}
