import { API_ENDPOINTS } from '@/config/constants'
import AdminWrapper from '@/layouts/AdminWrapper'
import requireAuthMiddleware from '@/middleware/requireAuthMiddleware'
import { Badge, Group, Stack, Text, Title } from '@mantine/core'
import { useRouter } from 'next/router'
import React, {  } from 'react'
import CreateEcommerceCategoryForm from '@/components/forms/CreateEcommerceCategoryForm'
import CustomDataTable from '@/components/tables/filters/CustomDataTable'
import { formatCurrency } from '@/config/functions'
import CustomCopyActionIcon from '@/components/common/CustomCopyActionIcon'

const Transactions = () => {

  return (
    <div>
      <Stack>
        <Title>Transactions</Title>
        <CustomDataTable
          url={API_ENDPOINTS.ECOMMERCE_TRANSACTIONS}
          height={"600px"}
          method={'GET'}
          defaultFilters={{
            page: 1,
            limit: '10',
            ordering: 'id',
            search: "",
            // fields: "id,name,description,created_at,modified_at"
          }}

          hideAddActionBtn={true}
          hideDeleteActionBtn={false}
          useNext={false}
          formValidators={undefined}
          hideUpdateActionBtn={true}
          updateData={{
            formNode: CreateEcommerceCategoryForm,
            modalSize: 'lg',
            updatingModalTitle: "Update Category",
            deletingModalTitle: "Delete Category"
          }}
          columns={[
            {
              accessor: 'id',
              title: 'ID',
              width: '80px',
              render: (item: any, i: number) => (
                <Text size='sm' fw={500}>{i + 1}</Text>
              )
            },
            {
              accessor: 'transaction_id',
              title: 'Transaction ID',
              width: '180px',
              render: (item: any) => (
                <Group gap={6}>
                  <CustomCopyActionIcon value={item?.transaction_id} size='sm' />
                  <Text size='sm' fw={500} ff={'monospace'} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {item?.transaction_id}
                  </Text>
                </Group>
              )
            },
            {
              accessor: 'order_number',
              title: 'Order Number',
              width: '150px',
              render: (item: any) => (
                <Text size='sm' fw={500}>
                  {item?.order_number || '-'}
                </Text>
              )
            },
            {
              accessor: 'amount',
              title: 'Amount',
              width: '120px',
              render: (item: any) => (
                <Text size='sm' fw={500}>
                  {item?.amount ? formatCurrency(item.amount) : '-'}
                </Text>
              )
            },
            {
              accessor: 'status',
              title: 'Status',
              width: '120px',
              render: (item: any) => {
                const statusColors: Record<string, string> = {
                  'PENDING': 'yellow',
                  'COMPLETED': 'green',
                  'FAILED': 'red'
                };
                return (
                  <Badge color={statusColors[item?.status] || 'gray'} variant='light'>
                    {item?.status_display || item?.status || '-'}
                  </Badge>
                );
              }
            },
            {
              accessor: 'payment_method',
              title: 'Payment Method',
              width: '150px',
              render: (item: any) => (
                <Text size='sm' fw={500}>
                  {item?.payment_method || '-'}
                </Text>
              )
            },
            {
              accessor: 'confirmation_code',
              title: 'Confirmation Code',
              width: '150px',
              render: (item: any) => (
                item?.confirmation_code ? (
                  <Group gap={6}>
                    <CustomCopyActionIcon value={item?.confirmation_code} size='sm' />
                    <Text size='sm' fw={500} ff={'monospace'}>
                      {item?.confirmation_code}
                    </Text>
                  </Group>
                ) : <Text size='sm' c="dimmed">-</Text>
              )
            },
            {
              accessor: 'created_on',
              title: 'Date',
              width: '150px',
              render: (item: any) => (
                <Text size='sm'>
                  {new Date(item?.created_on).toLocaleString()}
                </Text>
              )
            }
          ]}
          filterFields={[
            {
              accessor: 'limit',
              label: 'Limit',
              gridSize: 2,
              placeholder: '23',
              type: 'select',
              options: [
                { value: '2', label: '2' },
                { value: '5', label: '5' },
                { value: '10', label: '10' },
                { value: '15', label: '15' },
                { value: '20', label: '20' },
                { value: '50', label: '50' },
                { value: '100', label: '100' },
              ]
            },
            {
              accessor: 'search',
              label: 'Search',
              gridSize: 2,
              placeholder: 'Search by code',
              type: 'text'
            },
            {
              accessor: 'ordering',
              label: 'Ordering',
              gridSize: 2,
              placeholder: '23',
              type: 'select',
              options: [
                {
                  group: 'Ascending',
                  items: [
                    { value: 'id', label: 'ID' },
                    { value: 'code', label: 'Code' },
                  ]
                },
                {
                  group: 'Descending',
                  items: [
                    { value: '-id', label: 'ID' },
                    { value: '-code', label: 'Code' },
                  ]
                }
              ]
            },
          ]}
        />
      </Stack>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  requireAuthMiddleware(context.req, context.res, () => { })
  return {
    props: {}
  }
}

Transactions.PageLayout = AdminWrapper

export default Transactions 