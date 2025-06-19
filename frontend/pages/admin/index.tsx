import CustomCol from '@/components/common/CustomCol'
import WrapperBox from '@/components/common/WrapperBox'
import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS, TABLE_ICON_SIZE } from '@/config/constants'
import { IEcommerceStats, Stats } from '@/config/types'
import AdminWrapper from '@/layouts/AdminWrapper'
import requireAuthMiddleware from '@/middleware/requireAuthMiddleware'
import { useAppContext } from '@/providers/appProvider'
import { DonutChart } from '@mantine/charts'
import { ActionIcon, Box, Button, ColorSwatch, Grid, Group, LoadingOverlay, Stack, Text, Title, em } from '@mantine/core'
import { IconArticle, IconBuildingStore, IconCategory, IconDiscount2, IconForms, IconReceipt, IconShoppingBag, IconShoppingCart, IconStar, IconTag, IconTrash, IconUserStar, IconUsersGroup } from '@tabler/icons-react'
import React, { ReactNode, useEffect, useState } from 'react'
import { DASHBOARD_STAT_COL_SIZES, DASHBOARD_ICON_SIZE, DASHBOARD_ICON_STROKE, LOCAL_STORAGE_KEYS } from '@/config/constants';
import { showNotification } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import CustomDataTable from '@/components/tables/filters/CustomDataTable'
import CustomCopyActionIcon from '@/components/common/CustomCopyActionIcon'
import CreateAPIKeyForm from '@/components/forms/CreateAPIKeyForm'





interface IDeleteAPIKeyAction {
  item: any
}

const DeleteAPIKeyAction = (props: IDeleteAPIKeyAction) => {
  const { item } = props
  const [deleting, setDeleting] = useState(false)
  const { token } = useAppContext()

  const handleDelete = (id: any) => {
    let delete_url = `${API_ENDPOINTS.DELETE_API_KEYS}`
    let method = 'POST'
    setDeleting(true)
    makeRequestOne({
      url: delete_url,
      method,
      data: {
        id,
      },
      extra_headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res: any) => {
      showNotification({
        message: 'Deleted successfully',
        color: 'green'
      })
      modals.closeAll()
    }).catch((err: any) => {
      const errors = err?.response?.data
      showNotification({
        message: err?.response?.message ?? 'An error occurred',
        color: 'red'
      })
    }).finally(() => {
      setDeleting(false)
    })
  }

  const deleteModal = (id: any) => {
    return modals.open({
      title: "Delete Key",
      radius: "md",
      color: 'red',
      centered: true,
      children: (
        <Stack style={{ justify: "relative" }}>
          <LoadingOverlay visible={deleting} />
          <Text>
            Are you sure you want to delete this key?
          </Text>
          <Button radius="md" color='red' onClick={() => handleDelete(id)} >
            Delete
          </Button>
        </Stack>
      )
    })
  }

  return (
    <ActionIcon onClick={() => deleteModal(item?.id)} variant='light'
      size="md"
      radius="md"
      color='red'
    >
      <IconTrash size={TABLE_ICON_SIZE} stroke={em(1.5)} />
    </ActionIcon>
  )
}


const ApiKeysTable = () => {

  let { user, token } = useAppContext()

  return (
    <CustomDataTable
      url={API_ENDPOINTS.LIST_API_KEYS}
      method={'GET'}
      defaultFilters={{
        page: 1,
        limit: '10',
        ordering: 'id',
        search: "",
        // fields: "id,name,description,created_at,modified_at"
      }}
      height={'300px'}
      useNext={false}
      formValidators={undefined}
      hideUpdateActionBtn={true}
      hideDeleteActionBtn={true}
      updateData={{
        formNode: CreateAPIKeyForm,
        modalSize: 'lg',
        updatingModalTitle: "Update API Key",
        deletingModalTitle: "Delete API Key"
      }}
      extraActionButtons={[
        {
          title: 'Delete Key',
          color: 'red',
          element: DeleteAPIKeyAction,
        },
      ]}
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
          accessor: "name",
          title: "Name",
          width: "200px",
          render: (item: any, i: number) => (
            <Stack gap={0}>
              <Text size='sm' fw={500}>{item?.name}</Text>
              {/* <Text size='xs' fw={500} c={item?.network === 'mainnet' ? 'green' : 'yellow'}>{item?.network ?? '-'}</Text> */}
            </Stack>
          )
        },
        {
          accessor: "key",
          title: "API Key",
          width: "300px",
          render: (item: any, i: number) => (
            <Group gap={6}>
              {
                item?.key ? (
                  <CustomCopyActionIcon value={item?.key} size='sm' />
                ) : null
              }
              <Text size='sm' fw={400} ff={'monospace'} style={{
                fontVariantNumeric: 'tabular-nums'
              }}>{item?.key?.split('.')[0] ?? '-'}.{'*'.repeat(item?.key?.split('.')[1] ? 8 : 0)}</Text>
            </Group>
          )
        },
        {
          accessor: 'domain',
          title: 'Domain',
          width: '200px',
          render: (item: any) => (
            <Text size='xs' fw={500}>{item?.domain}</Text>
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
        // {
        //   accessor: 'search',
        //   label: 'Search',
        //   gridSize: 2,
        //   placeholder: 'Search by name',
        //   type: 'text'
        // },
      ]}
    />
  )
}

export interface IDashboardStat {
  title: string
  icon: ReactNode
  color: string
  value: string
  rightSectionText?: string
}

export const DashboardStat = (props: IDashboardStat) => {
  const { title, value, icon, color, rightSectionText } = props

  return (
    <WrapperBox color={color}>
      <Group>
        <ActionIcon color={color} size={52} variant='light' radius={'md'}>
          {icon}
        </ActionIcon>
        <Stack gap={20} flex={1}>
          <Text fw={500} size='md'>{title}</Text>
          <Group align='baseline' justify='space-between'>
            <Text fw={700} size='xl' lh={em(1.5)}>{value}</Text>
            <Text size='xs' fw={500} lh={em(1.5)}>{rightSectionText}</Text>
          </Group>
        </Stack>
      </Group>
    </WrapperBox>
  )
}


interface IDonutData {
  name: string
  value: number
  color: string
}

interface ICustomDonutChart {
  data: IDonutData[]
  color: string
  title: string
}

const CustomDonutChart = (props: ICustomDonutChart) => {
  const { title, data, color } = props

  return (
    <WrapperBox color={color}>
      <Stack gap={10}>
        <Title order={3}>{title}</Title>
        <Grid>
          <CustomCol span={6}>
            <DonutChart paddingAngle={10} tooltipDataSource='segment' data={data} />
          </CustomCol>
          <CustomCol span={6}>
            <Stack gap={4} className='h-100' justify='end'>
              {
                data?.map((item, i) => (
                  <Group key={`${title}_${color}_${i}`}>
                    <ColorSwatch radius={'md'} size={26} variant='outline' color={item.color} />
                    <Text size='sm' fw={500} tt={'capitalize'}>{item.value} {item.name}</Text>
                  </Group>
                ))
              }
            </Stack>
          </CustomCol>
        </Grid>
      </Stack>
    </WrapperBox>
  )
}

const Dashboard = () => {
  const { token } = useAppContext()
  const [userInfo, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats>()

  const { user } = useAppContext()

  const [ecommerceStats, setEcommerceStats] = useState<IEcommerceStats>()

  const loadStats = () => {
    if (token) {
      makeRequestOne({
        url: API_ENDPOINTS.ECOMMERCE_STATS,
        method: 'GET',
        extra_headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res: any) => {
        setEcommerceStats(res?.data)
      }).catch((err: any) => {
        console.error(err)
      })
    }
  }



  const loadAppStats = () => {
    if (token) {
      makeRequestOne({
        url: API_ENDPOINTS.APP_STATS,
        method: 'GET',
        extra_headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res: any) => {
        setStats(res?.data)
      }).catch((err: any) => {
        console.error(err)
      })
    }
  }

  useEffect(() => {
    setUser(user)
  }, [user])

  useEffect(() => {
    loadStats()
    loadAppStats()
  }, [token])

  return (
    <div>
      <Stack>
        <Stack gap={2}>
          <Title>Dashboard</Title>
          <Text size='md' fw={500}>Welcome back {userInfo?.username},</Text>
        </Stack>
        {/* Ecommerce Stats */}
        <Stack>
          <Grid>
            <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
              <DashboardStat
                title="Products"
                value={ecommerceStats?.total_products?.toString() ?? '0'}
                icon={<IconShoppingBag stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />}
                color='green'
              />
            </CustomCol>
            <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
              <DashboardStat
                title="Product Categories"
                value={ecommerceStats?.total_categories?.toString() ?? '0'}
                icon={<IconTag stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />}
                color='blue'
              />
            </CustomCol>
            <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
              <DashboardStat
                title="Orders"
                value={ecommerceStats?.total_orders?.toString() ?? '0'}
                icon={<IconReceipt stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />}
                color='violet'
              />
            </CustomCol>
            <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
              <DashboardStat
                title="Active Carts"
                value={ecommerceStats?.total_carts?.toString() ?? '0'}
                icon={<IconShoppingCart stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />}
                color='orange'
              />
            </CustomCol>
            <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
              <DashboardStat
                title="Discounts"
                value={ecommerceStats?.total_discounts?.toString() ?? '0'}
                icon={<IconDiscount2 stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />}
                color='pink'
              />
            </CustomCol>

            {/* App Stats */}
            <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
              <DashboardStat title="Users" value={stats?.users?.total?.toString()!!} icon={<IconUsersGroup stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
            </CustomCol>
            <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
              <DashboardStat title="Contact Form Entries"
                value={stats?.contact_form_entries?.total?.toString()!!} icon={<IconForms stroke={DASHBOARD_ICON_STROKE}
                  size={DASHBOARD_ICON_SIZE} />} color='pink' rightSectionText={`${stats?.contact_form_entries?.read?.toString() ?? 0}/${stats?.contact_form_entries?.total?.toString() ?? 0} read`} />
            </CustomCol>
            {/* <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Subscribers" value={stats?.subscribers?.toString()!!} icon={<IconUserStar stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
          </CustomCol> */}
            <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
              <DashboardStat title="Reviews" value={stats?.reviews?.toString()!!} icon={<IconStar stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
            </CustomCol>

            {/* Transactions */}
            <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
              <DashboardStat title="Pending Transactions" value={ecommerceStats?.transactions?.pending_transactions?.toString()!!} icon={<IconReceipt stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
            </CustomCol>
            <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
              <DashboardStat title="Completed Transactions" value={ecommerceStats?.transactions?.completed_transactions?.toString()!!} icon={<IconReceipt stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
            </CustomCol>
            <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
              <DashboardStat title="Failed Transactions" value={ecommerceStats?.transactions?.failed_transactions?.toString()!!} icon={<IconReceipt stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
            </CustomCol>
            {/* <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Blogs" value={stats?.blogs?.toString()!!} icon={<IconArticle stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='green' />
          </CustomCol>
          <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Blog Categories" value={stats?.categories?.toString()!!} icon={<IconCategory stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='green' />
          </CustomCol> */}

          </Grid>

          <Box mt={60}>
            <Grid>
              <CustomCol span={{ md: 6 }}>
                <WrapperBox color="violet">
                  <Stack gap={10}>
                    <Title order={3}>Order Status Distribution</Title>
                    <Grid>
                      <CustomCol span={6}>
                        <DonutChart
                          paddingAngle={10}
                          tooltipDataSource='segment'
                          data={[
                            { name: 'Pending', value: ecommerceStats?.orders_by_status?.pending ?? 0, color: 'yellow' },
                            { name: 'Paid', value: ecommerceStats?.orders_by_status?.paid ?? 0, color: 'blue' },
                            { name: 'Processing', value: ecommerceStats?.orders_by_status?.processing ?? 0, color: 'violet' },
                            { name: 'Shipped', value: ecommerceStats?.orders_by_status?.shipped ?? 0, color: 'green' },
                            { name: 'Delivered', value: ecommerceStats?.orders_by_status?.delivered ?? 0, color: 'cyan' },
                            { name: 'Cancelled', value: ecommerceStats?.orders_by_status?.cancelled ?? 0, color: 'red' },
                          ]}
                        />
                      </CustomCol>
                      <CustomCol span={6}>
                        <Stack gap={4} className='h-100' justify='end'>
                          {[
                            { name: 'Pending', value: ecommerceStats?.orders_by_status?.pending ?? 0, color: 'yellow' },
                            { name: 'Paid', value: ecommerceStats?.orders_by_status?.paid ?? 0, color: 'blue' },
                            { name: 'Processing', value: ecommerceStats?.orders_by_status?.processing ?? 0, color: 'blue' },
                            { name: 'Shipped', value: ecommerceStats?.orders_by_status?.shipped ?? 0, color: 'violet' },
                            { name: 'Delivered', value: ecommerceStats?.orders_by_status?.delivered ?? 0, color: 'green' },
                            { name: 'Cancelled', value: ecommerceStats?.orders_by_status?.cancelled ?? 0, color: 'red' },
                          ].map((item, i) => (
                            <Group key={`order_status_${i}`}>
                              <ColorSwatch radius={'md'} size={26} variant='outline' color={item.color} />
                              <Text size='sm' fw={500} tt={'capitalize'}>{item.value} {item.name}</Text>
                            </Group>
                          ))}
                        </Stack>
                      </CustomCol>
                    </Grid>
                  </Stack>
                </WrapperBox>
              </CustomCol>
              <CustomCol span={{ md: 6 }}>
                <WrapperBox color="indigo">
                  <Stack gap={10}>
                    <Title order={3}>Transactions</Title>
                    <Grid>
                      <CustomCol span={6}>
                        <DonutChart
                          paddingAngle={10}
                          tooltipDataSource='segment'
                          data={[
                            { name: 'Pending', value: ecommerceStats?.transactions?.pending_transactions ?? 0, color: 'yellow.4' },
                            { name: 'Completed', value: ecommerceStats?.transactions?.completed_transactions ?? 0, color: 'blue.4' },
                            { name: 'Failed', value: ecommerceStats?.transactions?.failed_transactions ?? 0, color: 'red.4' },
                          ]}
                        />
                      </CustomCol>
                      <CustomCol span={6}>
                        <Stack gap={4} className='h-100' justify='end'>
                          {[
                            { name: 'Pending', value: ecommerceStats?.transactions?.pending_transactions ?? 0, color: 'yellow.4' },
                            { name: 'Completed', value: ecommerceStats?.transactions?.completed_transactions ?? 0, color: 'blue.4' },
                            { name: 'Failed', value: ecommerceStats?.transactions?.failed_transactions ?? 0, color: 'red.4' },
                          ].map((item, i) => (
                            <Group key={`transaction_${i}`}>
                              <ColorSwatch radius={'md'} size={26} variant='outline' color={item.color.split('.')[0]} />
                              <Text size='sm' fw={500} tt={'capitalize'}>{item.value} {item.name}</Text>
                            </Group>
                          ))}
                        </Stack>
                      </CustomCol>
                    </Grid>
                  </Stack>
                </WrapperBox>
              </CustomCol>
            </Grid>
          </Box>
        </Stack>
        <Box mt={60}>
          <Grid>
            <CustomCol span={{ md: 6 }}>
              <CustomDonutChart
                title="Users Gender Distribution"
                color='indigo'
                data={[
                  { color: 'green', name: 'Female', value: stats?.users?.female ?? 0 },
                  { color: 'orange', name: 'Male', value: stats?.users?.male ?? 0 },
                  { color: 'gray', name: 'Not Say', value: stats?.users?.prefer_not_say ?? 0 }
                ]}
              />
            </CustomCol>
            <CustomCol span={{ md: 6 }}>
              <CustomDonutChart
                title="Contact Form"
                color='pink'
                data={[
                  { color: 'green', name: 'Read', value: stats?.contact_form_entries?.read ?? 0 },
                  { color: 'orange', name: 'UnRead', value: stats?.contact_form_entries?.unread ?? 0 }
                ]}
              />
            </CustomCol>
          </Grid>
        </Box>
        <Stack gap={2}>
          <Title order={2} w={700}>API Keys</Title>
          <Text size='md' fw={500}>Manage all the API Keys for the system</Text>
          <ApiKeysTable />
        </Stack>
      </Stack>
    </div>
  )
}


export async function getServerSideProps(context: any) {
  requireAuthMiddleware(context.req, context.res, () => { })
  const cookies = context.req.cookies
  const userDetails_: any = cookies[LOCAL_STORAGE_KEYS.user]

  const token = cookies[LOCAL_STORAGE_KEYS.token]

  const userDetails: any = JSON.parse(userDetails_ ?? "{}")

  return {
    props: {

    }
  }
}

Dashboard.PageLayout = AdminWrapper

export default Dashboard