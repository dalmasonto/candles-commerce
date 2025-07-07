import { makeRequestOne, toDate } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import AdminWrapper from '@/layouts/AdminWrapper'
import requireAuthMiddleware from '@/middleware/requireAuthMiddleware'
import { useAppContext } from '@/providers/appProvider'
import { ActionIcon, Badge, Button, Group, Paper, Select, Stack, Table, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { notifications } from '@mantine/notifications'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import DiscountForm from '@/components/forms/DiscountForm'
import CustomDataTable from '@/components/tables/filters/CustomDataTable'

interface IDiscount {
  id: number
  code: string
  description: string
  discount_type: 'percentage' | 'fixed'
  value: number
  min_purchase: number | null
  max_discount: number | null
  start_date: string
  end_date: string
  is_active: boolean
  usage_limit: number | null
  times_used: number
  is_first_purchase: boolean
  is_single_use: boolean
}

const DISCOUNT_TYPES = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed', label: 'Fixed Amount' }
]

const DiscountsPage = () => {
  const { token } = useAppContext()
  const router = useRouter()
  const [discounts, setDiscounts] = useState<IDiscount[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const form = useForm({
    initialValues: {
      code: '',
      description: '',
      discount_type: 'percentage',
      value: 0,
      min_purchase: null,
      max_discount: null,
      start_date: '',
      end_date: '',
      is_active: true,
      usage_limit: null,
      is_first_purchase: false,
      is_single_use: false
    },
    validate: {
      code: (value) => (!value ? 'Code is required' : null),
      value: (value) => (value <= 0 ? 'Value must be greater than 0' : null),
      discount_type: (value) => (!value ? 'Discount type is required' : null)
    }
  })

  const loadDiscounts = () => {
    setLoading(true)
    makeRequestOne({
      url: API_ENDPOINTS.ECOMMERCE_DISCOUNTS,
      method: 'GET',
      extra_headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res: any) => {
      setDiscounts(res?.data?.results || [])
    }).catch((err: any) => {
      console.error(err)
      notifications.show({
        title: 'Error',
        message: 'Failed to load discounts',
        color: 'red'
      })
    }).finally(() => {
      setLoading(false)
    })
  }

  const deleteDiscount = (id: number) => {
    if (!confirm('Are you sure you want to delete this discount?')) return

    setLoading(true)
    makeRequestOne({
      url: `${API_ENDPOINTS.ECOMMERCE_DISCOUNTS}/${id}`,
      method: 'DELETE',
      extra_headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
      notifications.show({
        title: 'Success',
        message: 'Discount deleted successfully',
        color: 'green'
      })
      loadDiscounts()
    }).catch((err: any) => {
      console.error(err)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete discount',
        color: 'red'
      })
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    loadDiscounts()
  }, [token])

  const filteredDiscounts = discounts.filter(discount =>
    discount.code.toLowerCase().includes(search.toLowerCase()) ||
    discount.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <Stack>
        <Title>Discounts</Title>
        <Paper withBorder p={{base: 0, md: "md"}} radius="lg">
          <Stack>

            <CustomDataTable
              url={API_ENDPOINTS.ECOMMERCE_DISCOUNTS}
              method={'GET'}
              defaultFilters={{
                page: 1,
                limit: '10',
                ordering: 'id',
                search: "",
                // fields: "id,name,description,created_at,modified_at"
              }}
              useNext={false}
              formValidators={undefined}
              hideUpdateActionBtn={false}
              updateData={{
                formNode: DiscountForm,
                modalSize: 'lg',
                updatingModalTitle: "Update Discount",
                deletingModalTitle: "Delete Discount"
              }}
              columns={[
                {
                  accessor: 'id',
                  title: 'ID',
                  width: '80px'
                },
                {
                  accessor: "code",
                  title: "Code",
                  width: "200px",
                },
                {
                  accessor: "description",
                  title: "Description",
                  width: "200px",
                },
                {
                  accessor: "discount_type",
                  title: "Discount Type",
                  width: "200px",
                },
                {
                  accessor: "value",
                  title: "Value",
                  width: "200px",
                },
                {
                  accessor: "min_purchase",
                  title: "Min Purchase",
                  width: "200px",
                },
                {
                  accessor: "max_discount",
                  title: "Max Discount",
                  width: "200px",
                },
                {
                  accessor: "start_date",
                  title: "Start Date",
                  width: "200px",
                },
                {
                  accessor: "end_date",
                  title: "End Date",
                  width: "200px",
                },
                {
                  accessor: "is_active",
                  title: "Is Active",
                  width: "200px",
                },
                {
                  accessor: "usage_limit",
                  title: "Usage Limit",
                  width: "200px",
                },
                {
                  accessor: "times_used",
                  title: "Times Used",
                  width: "200px",
                },
                {
                  accessor: "is_first_purchase",
                  title: "Is First Purchase",
                  width: "200px",
                },
                {
                  accessor: "is_single_use",
                  title: "Is Single Use",
                  width: "200px",
                },
                {
                  accessor: 'created_on',
                  title: 'Created On',
                  width: '250px',
                  render: (item: any) => (
                    <Text size='sm'>{toDate(item?.created_on, true)}</Text>
                  )
                },
                {
                  accessor: 'updated_on',
                  title: 'Modified On',
                  width: '250px',
                  render: (item: any) => (
                    <Text size='sm'>{toDate(item?.updated_on, true)}</Text>
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
        </Paper>
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

DiscountsPage.PageLayout = AdminWrapper

export default DiscountsPage 