import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import { Center, Title, TextInput, Text, PasswordInput, Group, Stack, Button, Anchor, Paper, Divider } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppContext } from '../../providers/appProvider';
import { API_ENDPOINTS, SEPARATOR, APP_NAME } from '@/config/constants';
import { makeRequestOne } from '@/config/config';
import { displayErrors } from '@/config/functions'
import { IconUser, IconPassword, IconLogin } from '@tabler/icons-react';
import HeaderAndFooterWrapper from '@/layouts/HeaderAndFooterWrapper';
import AuthPageBox from '@/components/auth/AuthPageBox';

const Login = () => {
  const [loading, setLoading] = useState(false)
  const { login, login_status } = useAppContext()

  const router = useRouter()

  const form = useForm({
    initialValues: {
      username: '',
      password: "",
    },

    validate: {
      username: (value) => (value === "" || value === null || value === undefined) ? "Enter username" : null,
      password: (value) => (value === "" || value === null || value === undefined) ? "Enter password" : null,
    },
  });

  const handleLogin = () => {
    setLoading(true)
    makeRequestOne({ url: API_ENDPOINTS.LOGIN, method: "POST", data: form.values, useNext: false, params: { fields: 'id,email,full_name,first_name,last_name,username,profile,phone_number,avatar' } }).then((res: any) => {
      login(res?.data?.user, res?.data?.token)
      router.push('/account')
    }).catch(error => {
      showNotification({
        title: "Account Login",
        message: "Login failed, please try again with correct credentials",
        color: "red"
      })
      const error_data = error?.data
      if (typeof error_data === 'object') {
        displayErrors(form, error_data)
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    if (login_status) {
      router.push("/")
    }
  }, [])
  // console.log(login_status)

  return (
    <>
      <Head>
        <title>{`Account Login ${SEPARATOR} ${APP_NAME}`}</title>
        <meta name="description" content="Log in to your account to get started. List businesses, list products, list services and shop on Sisi markets" />
      </Head>
      <AuthPageBox>
        <form onSubmit={form.onSubmit((values) => { handleLogin() })}>
          <Stack gap={30} p="md">
            <Stack gap={5} mb={10}>
              <Title ta='center' order={2} fw={700} c="violet.7">Welcome Back</Title>
              <Text ta='center' size="sm" c="dimmed">Login to access your admin dashboard</Text>
            </Stack>
            
            <Paper withBorder p="md" radius="md" shadow="sm">
              <Stack gap={20}>
                <TextInput
                  autoFocus
                  size="md"
                  radius="md"
                  label="Username"
                  placeholder='Enter your username'
                  leftSection={<IconUser size={18} color="#7950f2" />}
                  {...form.getInputProps('username')}
                />
                <PasswordInput
                  size="md"
                  radius="md"
                  label="Password"
                  placeholder="Enter your password"
                  leftSection={<IconPassword size={18} color="#7950f2" />}
                  {...form.getInputProps('password')}
                />
              </Stack>
            </Paper>

            <Button 
              radius="md" 
              loading={loading} 
              size="md"
              fullWidth
              leftSection={<IconLogin size={18} />} 
              type='submit'
              variant="gradient"
              gradient={{ from: 'violet', to: 'indigo', deg: 90 }}
            >
              Sign In
            </Button>
            
            <Divider label="Or" labelPosition="center" />
            
            <Group justify="center" gap="xl">
              <Anchor 
                component={Link} 
                href="/auth/password/reset" 
                fw={500} 
                size="sm"
                c="violet"
              >
                Forgot password?
              </Anchor>
              <Anchor 
                component={Link} 
                href={'/auth/signup'} 
                fw={500} 
                size="sm"
                c="violet"
              >
                Create an account
              </Anchor>
            </Group>
          </Stack>
        </form>
      </AuthPageBox>
    </>
  )
}

Login.PageLayout = HeaderAndFooterWrapper;

export default Login
