import React, { useState } from 'react'
import {
  Table,
  Input,
  Form,
  Popconfirm,
  Button,
  FormInstance,
  TableColumnType,
} from 'antd'
import styled from 'styled-components'
import { v4 } from 'uuid'
import { NoData } from './noData'
import { iconMap } from '../../utils/iconMap'
import { MessageText } from '../../utils/messages'

export enum TableColumnAlign {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export const TableEditColumnName = 'editColumnName'

export interface CustomTableColumn {
  title: string
  dataIndex: string
  editable?: boolean
  required?: boolean
  width?: number | string
  align?: TableColumnAlign
  render?: (text: string, record: any, index: number) => JSX.Element
  onCell?: (record: any, rowIndex: number) => CustomTableColumn
}

export interface CustomEditableCell {
  dataIndex: string
  component: JSX.Element
}

interface EditableCellProps {
  editing: boolean
  dataIndex: string
  children: any[]
  required: boolean
  className: string
  colSpan: number
  rowSpan: number
  style: any
  title: string
}

interface CustomTableProps {
  form: FormInstance<any>
  data: any[]
  setData: (data: any) => void
  columns: CustomTableColumn[]
  refreshData: () => void
  editRecord: (record: any) => void
  deleteRecord: (record: any) => void
  addRecord: (key: string) => void
  saveRecord: () => Promise<boolean>
  additionalButtons?: JSX.Element[]
  customEditableCell?: CustomEditableCell[]
}

export const CustomTable = (p: CustomTableProps) => {
  const [editingKey, setEditingKey] = useState<string>('')
  const disabled = editingKey !== ''

  const EditableCell = ({
    editing,
    dataIndex,
    children,
    required,
    title,
    ...restProps
  }: EditableCellProps) => {
    if (editing) {
      const defaultInput = <Input placeholder={title} />
      const customEditableCell = p.customEditableCell?.find(
        (item) => item.dataIndex === dataIndex
      )
      const component = customEditableCell
        ? customEditableCell.component
        : defaultInput

      return (
        <td {...restProps}>
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required,
                message: MessageText.requiredField,
              },
            ]}
          >
            {component}
          </Form.Item>
        </td>
      )
    }

    return <td {...restProps}>{children}</td>
  }

  const handleSaveRecord = async () => {
    const result = await p.saveRecord()
    if (result) setEditingKey('')
  }

  const handleCancel = (key: string) => {
    if (key.substring(0, 3) === 'NEW') {
      const oldData = p.data.filter((item) => item.key !== key)
      p.setData(oldData)
    }
    p.refreshData()
    setEditingKey('')
  }

  const handleEditRecord = (record: any) => {
    setEditingKey(record.key)
    p.editRecord(record)
  }

  const handleAddRecord = () => {
    const key = `NEW${v4()}`
    p.addRecord(key)
    setEditingKey(key)
  }

  const optionsCol = (_text: string, record: any, _index: number) =>
    record.key === editingKey ? (
      <>
        <Button type="link" onClick={handleSaveRecord}>
          Salva
        </Button>
        <Popconfirm
          title="Annullare?"
          onConfirm={() => handleCancel(record.key)}
          okText="Ok"
          cancelText="Indietro"
        >
          <Button type="link">Annulla</Button>
        </Popconfirm>
      </>
    ) : (
      <>
        <Button
          type="link"
          disabled={disabled}
          onClick={() => handleEditRecord(record)}
        >
          Modifica
        </Button>
        <Popconfirm
          title="Eliminare?"
          onConfirm={() => p.deleteRecord(record)}
          okText="Ok"
          cancelText="Indietro"
          disabled={disabled}
          icon={iconMap.deleteData}
        >
          <Button type="link" disabled={disabled}>
            Elimina
          </Button>
        </Popconfirm>
      </>
    )

  const mergedColumns: CustomTableColumn[] = p.columns.map(
    (col: CustomTableColumn, index: number) => {
      const editable = col.editable !== undefined ? col.editable : true
      if (!editable || col.dataIndex === TableEditColumnName)
        return {
          ...col,
          ...(index === p.columns.length - 1 && { render: optionsCol }),
        }

      const required = col.required !== undefined ? col.required : false
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: record.key === editingKey,
          required: required,
        }),
      }
    }
  )

  return (
    <TableWrapper>
      <Button
        type="primary"
        onClick={handleAddRecord}
        disabled={disabled}
        style={{
          marginBottom: '10px',
        }}
      >
        {iconMap.insert} Nuovo
      </Button>
      {p.additionalButtons?.map((AdditionalButton) => AdditionalButton)}
      <Form form={p.form} component={false} size="middle">
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={p.data}
          columns={mergedColumns as TableColumnType<any>[]}
          pagination={{ hideOnSinglePage: true }}
          rowClassName="editable-row"
          locale={{
            emptyText: <NoData />,
          }}
          tableLayout="fixed"
        />
      </Form>
    </TableWrapper>
  )
}

const TableWrapper = styled.div`
  .editable-row {
    height: 70px;
    & .ant-form-item-explain {
      position: absolute;
      top: 90%;
      font-size: 12px;
    }
  }
`
