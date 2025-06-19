import CustomCol from '@/components/common/CustomCol'
import { API_ENDPOINTS, DASHBOARD_ICON_SIZE, DASHBOARD_ICON_STROKE, DASHBOARD_STAT_COL_SIZES, LOCAL_STORAGE_KEYS } from '@/config/constants'
import AccountWrapper from '@/layouts/AccountWrapper'
import requireAuthMiddleware from '@/middleware/requireAuthMiddleware'
import { Stack, Title, Grid, Text } from '@mantine/core'
import { IconNotebook, IconUserCog, IconForms } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { DashboardStat } from '../admin'
import { makeRequestOne } from '@/config/config'
import { useAppContext } from '@/providers/appProvider'

const AccountDashboard = () => {

  const { token } = useAppContext()
  const [userInfo, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>()

  const { user } = useAppContext()

  const loadStats = () => {
    if (token) {
      makeRequestOne({
        url: API_ENDPOINTS.USER_STATS,
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
  }, [])


  return (
    <div>
      <Stack>
        <Stack gap={2}>
          <Title>Dashboard</Title>
          <Text size='md' fw={500}>Welcome back {userInfo?.username},</Text>
        </Stack>
        <Grid>
          <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Contact Form Entries" value={stats?.contact_form_entries?.toString() ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
          </CustomCol>
        </Grid>
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

AccountDashboard.PageLayout = AccountWrapper

export default AccountDashboard