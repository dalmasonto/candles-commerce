
import CreateUserForm from '@/components/forms/CreateUserForm'
import ChangePasswordForm from '@/components/forms/more_forms/ChangePasswordForm'
import ProfilePhotoForm from '@/components/forms/more_forms/ProfilePhotoForm'
import WrapperBox from '@/components/common/WrapperBox'
import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '@/config/constants'
import AccountWrapper from '@/layouts/AccountWrapper'
import requireAuthMiddleware from '@/middleware/requireAuthMiddleware'
import { useAppContext } from '@/providers/appProvider'
import { Box, Container, Stack, Title } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

interface IProfileSettings {
  user?: any
}

const ProfileSettings = (props: IProfileSettings) => {
  const { token } = useAppContext()
  const { user } = props

  return (
    <Container size={'md'}>
      <Stack>
        <Title>Profile Settings</Title>
        <WrapperBox color="blue">
          <Stack>
            <Title order={2}>Profile Photo</Title>
            <ProfilePhotoForm updating={false} />
          </Stack>
        </WrapperBox>
        <WrapperBox color="blue">
          <Stack>
            <Title order={2}>Update Account Information</Title>
            {/* {renderInfoUpdateForm()} */}
            {
              (!user?.farmer && !user?.agent) ? (
                <CreateUserForm updating={true} data={user} hideTitle={true} />
              ) : null
            }
          </Stack>
        </WrapperBox>
        <WrapperBox color="blue">
          <Stack>
            <Title order={2}>Password Settings</Title>
            <ChangePasswordForm updating={false} />
          </Stack>
        </WrapperBox>
      </Stack>
    </Container>
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
      user: userDetails
    }
  }
}

ProfileSettings.PageLayout = AccountWrapper

export default ProfileSettings