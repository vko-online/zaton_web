import React, { useState } from 'react'
import { filter } from 'fuzzaldrin-plus'
import moment from 'moment'
import {
  Table,
  Popover,
  Position,
  Menu,
  Text,
  IconButton,
  ArrowUpIcon,
  ArrowDownIcon,
  CaretDownIcon,
  MoreIcon,
  Pane,
  Badge,
  TextDropdownButton
} from 'evergreen-ui'
import { Product } from 'src/types'

const Order = {
  NONE: 'NONE',
  ASC: 'ASC',
  DESC: 'DESC'
}

const otherFields = [
  { label: 'Единица', value: 'unit' },
  { label: 'Описание', value: 'description' },
  { label: 'Фото', value: 'photoURL' },
  { label: 'Ссылка', value: 'url' },
  { label: 'Дата создания', value: 'createdAt' },
  { label: 'ID', value: 'id' },
  { label: 'Количество КП', value: 'offers' }
]

const noop = () => null
interface Props {
  data: Product[]
  onRemove?: (item: Product) => void
  onShare?: (item: Product) => void
  onEdit?: (item: Product) => void
}
export default function Component ({ data, onRemove = noop, onEdit = noop, onShare = noop }: Props) {
  const [state, setState] = useState({
    searchQuery: '',
    orderedColumn: 1,
    ordering: Order.NONE,
    column2Show: 'unit'
  })

  function sort (arr: Product[]) {
    const { ordering, orderedColumn } = state
    // Return if there's no ordering.
    if (ordering === Order.NONE) return arr

    // Get the property to sort each profile on.
    // By default use the `name` property.
    let propKey = 'name'
    // The second column is dynamic.
    if (orderedColumn === 2) propKey = state.column2Show
    // The third column is fixed to the `ltv` property.
    if (orderedColumn === 3) propKey = 'ltv'

    return arr.sort((a, b) => {
      const aValue = a[propKey]
      const bValue = b[propKey]

      // Support string comparison
      // const sortTable: any = { true: 1, false: -1 }

      // Order ascending (Order.ASC)
      if (state.ordering === Order.ASC) {
        return aValue === bValue ? 0 : aValue > bValue ? 1 : -1
      }

      // Order descending (Order.DESC)
      return bValue === aValue ? 0 : bValue > aValue ? 1 : -1
    })
  }

  // Filter the profiles based on the name property.
  function handleFilter (arr: Product[]) {
    const searchQuery = state.searchQuery.trim()

    // If the searchQuery is empty, return the profiles as is.
    if (searchQuery.length === 0) return arr

    return arr.filter((item) => {
      // Use the filter from fuzzaldrin-plus to filter by name.
      const result = filter([item.name], searchQuery)
      return result.length === 1
    })
  }

  function getIconForOrder (order) {
    switch (order) {
      case Order.ASC:
        return ArrowUpIcon
      case Order.DESC:
        return ArrowDownIcon
      default:
        return CaretDownIcon
    }
  }

  function handleFilterChange (value) {
    setState({ ...state, searchQuery: value })
  }

  function renderValueTableHeaderCell () {
    return (
      <Table.HeaderCell>
        <Popover
          position={Position.BOTTOM_LEFT}
          content={({ close }) => (
            <Menu>
              <Menu.OptionsGroup
                title='Порядок'
                options={[
                  { label: 'По возрастанию', value: Order.ASC },
                  { label: 'По убыванию', value: Order.DESC }
                ]}
                selected={state.orderedColumn === 2 ? state.ordering : null}
                onChange={(value) => {
                  setState({
                    ...state,
                    orderedColumn: 2,
                    ordering: value
                  })
                  // Close the popover when you select a value.
                  close()
                }}
              />
              <Menu.Divider />
              <Menu.OptionsGroup
                title='Show'
                options={otherFields}
                selected={state.column2Show}
                onChange={(value) => {
                  setState({
                    ...state,
                    column2Show: value
                  })
                  // Close the popover when you select a value.
                  close()
                }}
              />
            </Menu>
          )}
        >
          <TextDropdownButton
            icon={
              state.orderedColumn === 2
                ? getIconForOrder(state.ordering)
                : CaretDownIcon
            }
          >
            {otherFields.find(v => v.value === state.column2Show).label}
          </TextDropdownButton>
        </Popover>
      </Table.HeaderCell>
    )
  }

  function renderLTVTableHeaderCell () {
    return (
      <Table.TextHeaderCell>
        <Popover
          position={Position.BOTTOM_LEFT}
          content={({ close }) => (
            <Menu>
              <Menu.OptionsGroup
                title='Порядок'
                options={[
                  { label: 'По возрастанию', value: Order.ASC },
                  { label: 'По убыванию', value: Order.DESC }
                ]}
                selected={state.orderedColumn === 3 ? state.ordering : null}
                onChange={(value) => {
                  setState({
                    ...state,
                    orderedColumn: 3,
                    ordering: value
                  })
                  // Close the popover when you select a value.
                  close()
                }}
              />
            </Menu>
          )}
        >
          <TextDropdownButton
            icon={
              state.orderedColumn === 3
                ? getIconForOrder(state.ordering)
                : CaretDownIcon
            }
          >
            LTV
          </TextDropdownButton>
        </Popover>
      </Table.TextHeaderCell>
    )
  }

  function renderRowMenu (item) {
    return (
      <Menu>
        <Menu.Group>
          <Menu.Item onClick={() => onShare(item)}>Share...</Menu.Item>
          <Menu.Item onClick={() => onEdit(item)}>Edit...</Menu.Item>
        </Menu.Group>
        <Menu.Divider />
        <Menu.Group>
          <Menu.Item intent='danger' onClick={() => onRemove(item)}>
            Delete...
          </Menu.Item>
        </Menu.Group>
      </Menu>
    )
  }

  function renderRow ({ item }: { item: Product }) {
    return (
      <Table.Row key={item.id}>
        <Table.Cell display='flex' flexDirection='column' alignItems='flex-start'>
          <Text size={500} fontWeight={500}>
            {item.name}
          </Text>
          <Pane flexDirection='row'>
            {
              item.tags?.map(v => (
                <Badge size={300} key={v} color='neutral' marginRight={8}>{v}</Badge>
              ))
            }
          </Pane>
        </Table.Cell>
        <Table.TextCell>
          {
            state.column2Show === 'createdAt'
              ? moment((item[state.column2Show]).toDate()).calendar('L')
              : item[state.column2Show]
          }
        </Table.TextCell>
        <Table.TextCell isNumber>₸ {item.ltv || 0}</Table.TextCell>
        <Table.Cell width={48} flex='none'>
          <Popover
            content={() => renderRowMenu(item)}
            position={Position.BOTTOM_RIGHT}
          >
            <IconButton icon={MoreIcon} height={24} appearance='minimal' />
          </Popover>
        </Table.Cell>
      </Table.Row>
    )
  }

  const items = handleFilter(sort(data))
  return (
    <Table border>
      <Table.Head>
        <Table.SearchHeaderCell
          onChange={handleFilterChange}
          placeholder='Поиск...'
          value={state.searchQuery}
        />
        {renderValueTableHeaderCell()}
        {renderLTVTableHeaderCell()}
        <Table.HeaderCell width={48} flex='none' />
      </Table.Head>
      <Table.VirtualBody height={640}>
        {items.map((item) => renderRow({ item }))}
      </Table.VirtualBody>
    </Table>
  )
}
