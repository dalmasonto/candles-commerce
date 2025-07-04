import { makeRequestOne, toDate } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import AdminWrapper from '@/layouts/AdminWrapper'
import requireAuthMiddleware from '@/middleware/requireAuthMiddleware'
import { useAppContext } from '@/providers/appProvider'
import { ActionIcon, Alert, Badge, Box, Button, Card, CopyButton, em, Group, Paper, Select, Stack, Table, Text, Title } from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { notifications } from '@mantine/notifications'
import { IconCopy, IconExternalLink, IconEye } from '@tabler/icons-react'
import CustomDataTable from '@/components/tables/filters/CustomDataTable'
import { modals } from '@mantine/modals'
import { formatCurrency } from '@/config/functions'
import { DataTable } from 'mantine-datatable'

interface IOrder {
  id: number;
  created_on: string;
  updated_on: string;

  cart: number;
  items: {
    id: number;
    product: number;
    quantity: number;
    price: string;
    product_name: string;
    total_price: string;
    created_on: string;
    updated_on: string;
  }[];
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'paid';
  status_display: string;
  shipping_address: string;
  billing_address: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  subtotal: string;
  shipping_cost: string;
  tax: string;
  discount: string;
  discount_code: number | null;
  total: string;
  notes: string;
  tracking_number: string;
  is_paid: boolean;
  estimated_delivery: string | null;

  // Tx info
  payment_url: string;
  transaction?: {
    id: number;
    order: number;
    transaction_id: string;
    amount: string;
    currency: string;
    status: string;
    status_display: string;
    payment_method: string;
    pesapal_merchant_reference: string;
    pesapal_order_tracking_id: string;
    pesapal_redirect_url: string;
    transaction_init_info: {
      order_tracking_id: string;
      merchant_reference: string;
      redirect_url: string;
      error: null | any;
      status: string;
    };
    ipn_data?: {
      OrderTrackingId: string;
      OrderNotificationType: string;
      OrderMerchantReference: string;
    };
    all_transaction_info_after_callback?: {
      payment_method: string;
      amount: number;
      created_date: string;
      confirmation_code: string;
      order_tracking_id: string;
      payment_status_description: string;
      description: null | string;
      message: string;
      payment_account: string;
      call_back_url: string;
      status_code: number;
      merchant_reference: string;
      account_number: null | string;
      payment_status_code: string;
      currency: string;
      error: {
        error_type: null | string;
        code: null | string;
        message: null | string;
      };
      status: string;
    };
    confirmation_code?: string;
    created_on: string;
    updated_on?: string;
  }
}


const ViewOrderInformation = ({ item }: { item: IOrder }) => {
  const order = item

  let orderInformation: Record<string, string | number>[] = [
    { property: "Order Number", value: order.order_number },
    { property: "Status", value: order.status },
    { property: "Customer", value: `${order.first_name} ${order.last_name}` },
    { property: "Email", value: order.email },
    { property: "Phone", value: order.phone_number },
    { property: "Shipping Address", value: order.shipping_address },
    { property: "Billing Address", value: order.billing_address },
    { property: "Subtotal", value: formatCurrency(order.subtotal) },
    { property: "Shipping Cost", value: formatCurrency(order.shipping_cost) },
    { property: "Tax", value: formatCurrency(order.tax) },
    { property: "Discount", value: formatCurrency(order.discount) },
    { property: "Discount Code", value: order.discount_code ?? "N/A" },
    { property: "Total", value: formatCurrency(order.total) },
    { property: "Notes", value: order.notes },
    // { property: "Tracking Number", value: order.tracking_number }
  ];

  const openModal = () => modals.open({
    title: 'Order Information',
    size: "xl",
    radius: "lg",
    children: (
      <Stack>
        <Title order={3}>Order Information</Title>
        <Card radius={"md"}>
          <Stack>
            <Group justify="apart">
              <Text fw={500}>Order Number: {order.order_number}</Text>
              <Badge color={order.is_paid ? 'green' : 'orange'} variant="light" size="lg">
                {order.is_paid ? 'Paid' : 'Pending Payment'}
              </Badge>
            </Group>
            
            {order.is_paid ? (
              <>
                <Alert color="green" radius={"md"} title="Payment Completed">
                  This order has been paid using {order.transaction?.payment_method || 'online payment'}
                  {order.transaction?.confirmation_code && (
                    <Text size="sm" mt="xs">Confirmation Code: {order.transaction.confirmation_code}</Text>
                  )}
                </Alert>
                {order.transaction?.all_transaction_info_after_callback?.payment_account && (
                  <Text size="sm" c="dimmed">Paid via: {order.transaction.all_transaction_info_after_callback.payment_account}</Text>
                )}
              </>
            ) : (
              <>
                <Text>Payment URL:</Text>
                <Alert radius={"md"}>
                  {order.payment_url}
                </Alert>
                <Group>
                  <Button rightSection={<IconExternalLink stroke={em(1.5)} size={"20px"} />} variant="outline" radius={"md"} onClick={() => window.open(order.payment_url, '_blank')}>
                    Open Payment URL
                  </Button>
                  <CopyButton value={order.payment_url}>
                    {({ copied, copy }) => (
                      <Button color={copied ? 'teal' : 'blue'} leftSection={<IconCopy stroke={em(1.5)} size={"20px"} />} onClick={copy} radius="md">
                        {copied ? 'Copied URL' : 'Copy URL'}
                      </Button>
                    )}
                  </CopyButton>
                </Group>
              </>
            )}
          </Stack>
        </Card>
        <Card radius={"md"} p={0} style={{overflow: "hidden"}}>
        <Table withColumnBorders withRowBorders cellSpacing={"10px"} style={{borderRadius: "10px"}}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Property</Table.Th>
              <Table.Th>Value</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {
              orderInformation.map((item, i: number) => (
                <Table.Tr>
                  <Table.Td fw={600}>{item.property}</Table.Td>
                  <Table.Td tt={"capitalize"}>{item.value}</Table.Td>
                </Table.Tr>
              ))
            }
          </Table.Tbody>
        </Table>
        </Card>
        <Stack>
          <Title order={3}>Items</Title>
          <DataTable
            withTableBorder
            borderRadius="lg"
            columns={[
              {
                accessor: "product_name",
                width: "100px"
              },
              {
                accessor: "quantity",
                width: "100px",
                render: (item: any) => (
                  <Text>{`${item.quantity} @${formatCurrency(parseFloat(item.price))}`}</Text>
                )
              },
              {
                accessor: "Total Price",
                width: "100px",
                render: (item: any) => (
                  <Text>{formatCurrency(parseFloat(item.total_price))}</Text>
                )
              }
            ]}
            records={order.items}
          />
        </Stack>
      </Stack>
    )
  })

  return <ActionIcon onClick={openModal} variant='light' radius={"sm"}>
    <IconEye size={20} />
  </ActionIcon>
}

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
]

const OrdersPage = () => {
  const { token } = useAppContext()
  const router = useRouter()
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const loadOrders = () => {
    setLoading(true)
    makeRequestOne({
      url: API_ENDPOINTS.ECOMMERCE_ORDERS,
      method: 'GET',
      extra_headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res: any) => {
      setOrders(res?.data?.results || [])
    }).catch((err: any) => {
      console.error(err)
      notifications.show({
        title: 'Error',
        message: 'Failed to load orders',
        color: 'red'
      })
    }).finally(() => {
      setLoading(false)
    })
  }

  const updateOrderStatus = (orderId: number, status: string) => {
    setLoading(true)
    makeRequestOne({
      url: `${API_ENDPOINTS.ECOMMERCE_ORDERS}/${orderId}/update_status`,
      method: 'POST',
      data: { status },
      extra_headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
      notifications.show({
        title: 'Success',
        message: 'Order status updated successfully',
        color: 'green'
      })
      loadOrders()
    }).catch((err: any) => {
      console.error(err)
      notifications.show({
        title: 'Error',
        message: 'Failed to update order status',
        color: 'red'
      })
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    loadOrders()
  }, [token])

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase()) ||
      `${order.first_name} ${order.last_name}`.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = !statusFilter || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'yellow.5'
      case 'paid':
        return 'green.5'
      case 'processing':
        return 'blue.5'
      case 'shipped':
        return 'cyan.5'
      case 'delivered':
        return 'green.5'
      case 'cancelled':
        return 'red.5'
      default:
        return 'gray.5'
    }
  }

  return (
    <div>
      <Stack>
        <Title>Orders</Title>
        <Paper withBorder p={{ base: 0, md: "md" }} radius={"lg"}>
          <Stack>

            <CustomDataTable
              url={API_ENDPOINTS.ECOMMERCE_ORDERS}
              method={'GET'}
              height={"600px"}
              defaultFilters={{
                page: 1,
                limit: '10',
                ordering: 'id',
                search: "",
              }}
              hideAddActionBtn={true}
              useNext={false}
              formValidators={undefined}
              hideUpdateActionBtn={true}
              updateData={{
                formNode: <></>,
                modalSize: 'lg',
                updatingModalTitle: "Update Order",
                deletingModalTitle: "Delete Order"
              }}
              extraActionButtons={[
                {
                  title: 'View Order Information',
                  element: ViewOrderInformation,
                  color: 'orange'
                }
              ]}
              columns={[
                {
                  accessor: 'id',
                  title: 'ID',
                  width: '80px'
                },
                {
                  accessor: 'order_number',
                  title: 'Order #',
                  width: '150px'
                },
                {
                  accessor: 'status',
                  title: 'Status',
                  width: '200px',
                  render: (item: any) => {
                    return (
                      <Stack>
                        <Select
                          radius={"md"}
                          leftSection={<Box bg={getStatusColor(item.status)} w={20} h={20} style={{ borderRadius: '50%' }} />}
                          size='sm'
                          value={item.status}
                          onChange={(value) => updateOrderStatus(item.id, value as string)}
                          data={ORDER_STATUSES}
                        />
                      </Stack>
                    );
                  }
                },
                {
                  accessor: 'customer',
                  title: 'Customer',
                  width: '250px',
                  render: (item: any) => (
                    <Stack gap={2}>
                      <Text size="sm" fw={500}>{`${item.first_name} ${item.last_name}`}</Text>
                      <Text size="xs" color="dimmed">{item.email}</Text>
                    </Stack>
                  )
                },
                {
                  accessor: 'phone_number',
                  title: 'Phone',
                  width: '150px'
                },
                {
                  accessor: 'amount',
                  title: 'Amount',
                  width: '150px',
                  render: (item: any) => (
                    <Text size="sm" fw={500}>
                      {formatCurrency(item.total)}
                    </Text>
                  )
                },
                {
                  accessor: "cart",
                  title: "Cart",
                  width: "200px",
                  render: (item: any, i: number) => {
                    return (
                      <Stack gap={0}>
                        <Text>Products: {item?.items?.length}</Text>
                        <Text>Quantity: {item?.items?.reduce((accumulator: number, itemEntry: any) => accumulator + itemEntry.quantity, 0)}</Text>
                      </Stack>
                    )
                  }
                },
                {
                  accessor: 'dates',
                  title: 'Created On',
                  width: '250px',
                  render: (item: any) => (
                    <Stack gap={2}>
                      <Text size="sm">{toDate(item?.created_on, true)}</Text>
                      {item.estimated_delivery && (
                        <Text size="xs" color="dimmed">
                          Est. delivery: {toDate(item.estimated_delivery, false)}
                        </Text>
                      )}
                    </Stack>
                  )
                },
              ]}
              filterFields={[
                {
                  accessor: 'limit',
                  label: 'Limit',
                  gridSize: 2,
                  placeholder: '10',
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
                  placeholder: 'Search by order # or name',
                  type: 'text'
                },
                {
                  accessor: 'status',
                  label: 'Status',
                  gridSize: 2,
                  type: 'select',
                  placeholder: 'All Statuses',
                  options: [
                    { value: '', label: 'All Statuses' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'processing', label: 'Processing' },
                    { value: 'shipped', label: 'Shipped' },
                    { value: 'delivered', label: 'Delivered' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]
                },
                {
                  accessor: 'ordering',
                  label: 'Ordering',
                  gridSize: 2,
                  type: 'select',
                  placeholder: 'ID',
                  options: [
                    {
                      group: 'Ascending',
                      items: [
                        { value: 'id', label: 'ID' },
                        { value: 'order_number', label: 'Order #' },
                        { value: 'created_on', label: 'Created Date' },
                        { value: 'total', label: 'Amount' },
                      ]
                    },
                    {
                      group: 'Descending',
                      items: [
                        { value: '-id', label: 'ID' },
                        { value: '-order_number', label: 'Order #' },
                        { value: '-created_on', label: 'Created Date' },
                        { value: '-total', label: 'Amount' },
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

OrdersPage.PageLayout = AdminWrapper

export default OrdersPage 