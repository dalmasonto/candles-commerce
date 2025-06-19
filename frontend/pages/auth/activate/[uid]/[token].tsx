import React, { useState } from 'react'
import { Center, Stack, Text, Title, Loader, Button } from '@mantine/core';
import { useRouter } from 'next/router';
import { makeRequestOne } from '@/config/config';
import { API_ENDPOINTS } from '@/config/constants';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import HeaderAndFooterWrapper from '@/layouts/HeaderAndFooterWrapper';

const Index = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleActivation = () => {
    setLoading(true)
    makeRequestOne({
      url: `${API_ENDPOINTS.REQUEST_PASSWORD_RESET}/account/activate/`, method: "POST", data: {
        token: router?.query?.token,
        uidb64: router?.query?.uid,
      }
    }).then((res: any) => {
      showNotification({
        title: "Account Activation",
        message: "Activation successful",
        color: "green"
      })
      router.push("/auth/login")
    }).catch(() => {
      showNotification({
        title: "Account Activation",
        message: "Activation failed, please try again later or request for a new activation link.",
        color: "red"
      })
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <Center className='min-height'>
      <Stack>
        <Title ta='center' style={{ fontWeight: 500 }} order={2}>Thank you for creating an account with us.</Title>
        <Text ta='center' size="sm" >Activate your account by clicking on the button below</Text>
        <Button radius="md" onClick={handleActivation} rightSection={loading ? <Loader size={16} /> : <IconCheck size={16} />} type='button'>
          Activate account
        </Button>
      </Stack>
    </Center>
  )
}

Index.PageLayout = HeaderAndFooterWrapper;

export default Index