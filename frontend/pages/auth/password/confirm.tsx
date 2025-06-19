import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import { Center, Grid, Title, Text, Group, Loader, Stack, PasswordInput, Button, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IconAlertCircle, IconAlertTriangle, IconPassword, IconCheck } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useAppContext } from '../../../providers/appProvider';
import { makeRequestOne } from '@/config/config';
import { API_ENDPOINTS, SEPARATOR, APP_NAME } from '@/config/constants';
import { displayErrors } from '@/config/functions';
import HeaderAndFooterWrapper from '@/layouts/HeaderAndFooterWrapper';
import AuthPageBox from '@/components/auth/AuthPageBox';

const Confirm = () => {
    const [loading, setLoading] = useState(false)

    const matches = useMediaQuery('(max-width: 992px)');

    const { login, login_status } = useAppContext()
    const router = useRouter()

    const form = useForm({
        initialValues: {
            password: "",
            password1: "",
        },

        validate: {
            password: (value) => (value === "" || value === null || value === undefined) ? "Password is required" : null,
            password1: (value) => {
                if (value === "" || value === null || value === undefined) {
                    return "Repeat Your password"
                }
                if (value !== form.values.password) {
                    return "Passwords do not match"
                }
                return null
            },
        },
    });

    console.log(router.query)

    const handleLogin = () => {
        let data: any = form.values
        data['token'] = router.query.token

        setLoading(true)
        makeRequestOne({ url: API_ENDPOINTS.PASSWORD_RESET_CONFIRM, method: "POST", data }).then((res: any) => {
            showNotification({
                title: "Password Change",
                message: "You have successfully reset your password",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            router.push('/auth/login')
        }).catch(error => {

            const error_data = error?.response?.data
            if (typeof error_data === 'object') {
                displayErrors(form, error_data)
            }
            if (error_data?.detail === 'Not found.') {
                showNotification({
                    title: "Password Change Failed",
                    message: "The reset token has already been used",
                    color: "red",
                    icon: <IconAlertTriangle stroke={1.5} />
                })
            }

            showNotification({
                title: "Password Change Failed",
                message: error?.message,
                color: "red",
                icon: <IconAlertTriangle stroke={1.5} />
            })

        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        if (login_status) {
            router.push("/")
        }
    }, [])

    return (
        <>
            <Head>
                <title>{`Account Password Change ${SEPARATOR} ${APP_NAME}`}</title>
                <meta name="description" content="Log in to your account to get started. List businesses, list products, list services and shop on Sisi markets" />
            </Head>
            <AuthPageBox>
                <form onSubmit={form.onSubmit(() => { handleLogin() })}>
                    <Grid py={'20px'}>
                        <Grid.Col span={{ md: 12 }} px="md" py="xl" style={{
                            // background: "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(/images/login.png)",
                            backgroundSize: "cover"
                        }}>
                            <Stack gap={16}>
                                <Title ta='center' order={2} >Password Change</Title>
                                <Text ta='center' size="sm" >Reset your password by providing a new password</Text>
                                <PasswordInput
                                    radius="md"
                                    label="New Password"
                                    placeholder='Enter your new password'
                                    leftSection={<IconPassword stroke={1.5} />}
                                    {...form.getInputProps('password')}
                                />
                                <PasswordInput
                                    radius="md"
                                    label="Repeat New Password"
                                    placeholder='Repeat your password'
                                    leftSection={<IconPassword stroke={1.5} />}
                                    {...form.getInputProps('password1')}
                                />

                                <Group justify="apart" style={{ textAlign: "center" }}>
                                    <Button radius="md" rightSection={loading ? <Loader size={16} /> : <IconCheck size={16} />} type='submit'>
                                        Change Password
                                    </Button>
                                </Group>
                                <Center >
                                    <Anchor component={Link} href="/auth/login" passHref>
                                        Know your password? Login
                                    </Anchor>
                                </Center>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </form>
            </AuthPageBox>
        </>
    )
}

Confirm.PageLayout = HeaderAndFooterWrapper;

export default Confirm