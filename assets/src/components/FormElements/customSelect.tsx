import React, { useState, useEffect } from 'react'
import { Select } from 'antd'
import { v4 } from 'uuid'
import useSWR from 'swr'

interface Callback {
  callbackValue: string
  callbackSet: (value: any) => void
}

interface ListStaticProps {
  initValue: any
  setState: (state: any) => void
  placeholder?: string
  endpoint?: string
  staticOptions?: DataInterface[]
  callbackList?: Callback[]
  addNew?: boolean
}

interface DataInterface {
  value: any
  description?: string
  label?: string
}

export const CustomSelect = (p: ListStaticProps) => {
  const [data, setData] = useState<DataInterface[]>([])
  const [filteredData, setFilteredData] = useState<DataInterface[]>([])
  const [value, setValue] = useState<any>(p.initValue)
  const { data: dataFetch }: { data?: DataInterface[] } = useSWR(p.endpoint)
  const addNew = p.addNew !== undefined ? p.addNew : false

  useEffect(() => {
    if (dataFetch) {
      const fetchedData: DataInterface[] = dataFetch.map(
        (result: DataInterface) => {
          const callbackValues = p.callbackList?.reduce(
            (acc: any, callback: Callback) => ({
              ...acc,
              [callback.callbackValue]: result[callback.callbackValue],
            }),
            {}
          )

          return {
            value: result.value,
            description: result.description || result.value,
            label: result.label || result.description || result.value,
            ...callbackValues,
          }
        }
      )
      setData([...data, ...fetchedData])
      setFilteredData([...filteredData, ...fetchedData])
    }
  }, [dataFetch])

  useEffect(() => {
    const staticOptions: DataInterface[] = p.staticOptions
      ? p.staticOptions.reduce(
          (acc: DataInterface[], option: DataInterface) => {
            const callbackValues = p.callbackList?.reduce(
              (acc: any, callback: Callback) => ({
                ...acc,
                [callback.callbackValue]: option[callback.callbackValue],
              }),
              {}
            )
            const newOption = {
              value: option.value,
              description: option.description || option.value,
              label: option.label || option.description || option.value,
              ...callbackValues,
            }
            return [...acc, newOption]
          },
          []
        )
      : []

    setData([...data, ...staticOptions, ...(dataFetch || [])])
    setFilteredData([...filteredData, ...staticOptions, ...(dataFetch || [])])
  }, [])

  const handleChange = (_valueChanged: any, optionChanged: any) => {
    const option = optionChanged?.value ? optionChanged.value : null

    p.setState(option)
    setValue(option)
    p.callbackList?.map((callback: Callback) =>
      callback.callbackSet(
        optionChanged && optionChanged[callback.callbackValue]
          ? optionChanged[callback.callbackValue]
          : null
      )
    )
  }

  const handleClear = () => {
    p.setState(null)
    setValue(null)
    setFilteredData(data)
    p.callbackList?.forEach((callback: Callback) => callback.callbackSet(null))
  }

  const getOptions = () =>
    filteredData.map((option: DataInterface) => {
      const callbackValues = p.callbackList?.reduce(
        (acc: any, callback: Callback) => ({
          ...acc,
          [callback.callbackValue]: option[callback.callbackValue],
        }),
        {}
      )

      return (
        <Select.Option
          key={v4()}
          value={option.value}
          label={option.label}
          {...callbackValues}
        >
          {option.description}
        </Select.Option>
      )
    })

  const handleSearch = (valueSearched: string) => {
    const filteredData = data.filter((option: DataInterface) =>
      option.description?.toLowerCase().includes(valueSearched.toLowerCase())
    )

    const result: DataInterface[] = !valueSearched
      ? data
      : filteredData.length > 0
      ? filteredData
      : addNew
      ? [
          {
            value: valueSearched,
            description: `NUOVO: ${valueSearched}`,
            label: valueSearched,
          },
        ]
      : []

    setFilteredData(result)
  }

  const filterOptions = (input: string, option: any) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  return (
    <Select
      showSearch
      allowClear
      value={value}
      placeholder={p.placeholder}
      onChange={handleChange}
      onClear={handleClear}
      onSearch={handleSearch}
      filterOption={filterOptions}
      optionLabelProp="label"
      disabled={p.endpoint !== undefined && !dataFetch}
      loading={p.endpoint !== undefined && !dataFetch}
      notFoundContent={null}
    >
      {getOptions()}
    </Select>
  )
}
