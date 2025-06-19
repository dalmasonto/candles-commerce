import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { displayErrors } from '@/config/functions'
import { Anchor, Button, Center, Grid, Group, Stack, Switch, Text, Title, useMantineColorScheme } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconAlertCircle, IconAlertTriangle, IconUserPlus } from '@tabler/icons-react'
import Link from 'next/link'
import React, { useState } from 'react'
import CreateUserFormJustInputs from './more_forms/CreateUserFormJustInputs'
import SelectCountryInput from '../common/SelectCountryInput'
import { useAppContext } from '@/providers/appProvider'

const CustomCol = (props: any) => {
    const { children, ...rest } = props
    return (
        <Grid.Col {...rest}>
            {children}
        </Grid.Col>
    )
}

interface ICreateUserForm {
    updating?: boolean
    data?: any
    mutate?: any
    is_admin?: boolean
    hideTitle?: boolean
}


interface IForm {
    [key: string]: any
}

const CreateUserForm = (props: ICreateUserForm) => {
    const { updating, data, mutate, is_admin, hideTitle } = props
    const { colorScheme } = useMantineColorScheme()
    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()

    const form = useForm<IForm>({
        initialValues: {
            user: {
                first_name: updating ? data?.first_name : "",
                last_name: updating ? data?.last_name : "",
                username: updating ? data?.username : "",
                password: updating ? "pass" : "",
                password_repeat: updating ? "pass" : "",
                email: updating ? data?.email : "",
                profile: {
                    phone_number: updating ? data?.profile?.phone_number : "",
                    country: updating ? data?.profile?.country?.id?.toString() : "",
                    gender: updating ? data?.profile?.gender : "",
                },
                is_active: updating ? data?.is_active : true,
                is_superuser: updating ? data?.is_superuser : false,
            }
        },

        validate: {
            user: {
                first_name: (value) => (value === "" || value === null || value === undefined) ? "First name is required" : null,
                last_name: (value) => (value === "" || value === null || value === undefined) ? "Last name is required" : null,
                email: (value) => (value === "" || value === null || value === undefined) ? "Email is required" : null,
                username: (value) => (value === "" || value === null || value === undefined) ? "Username is required" : null,
                password: (value) => {
                    if (value === "") {
                        return "Password is required"
                    }
                    else if (value !== form.values.user.password_repeat) {
                        return "Passwords do not match"
                    }
                    else {
                        return null
                    }
                },
                password_repeat: (value) => {
                    if (value === "") {
                        return "Repeat Your Password"
                    }
                    else if (value !== form.values.user.password_repeat) {
                        return "Passwords do not match"
                    }
                    else {
                        return null
                    }
                },
            }
        },
    });

    const handleSubmit = () => {
        setLoading(true)
        const data_ = JSON.parse(JSON.stringify(form.values))
        delete data_["password_repeat"];
        data_.user.is_staff = data_.user?.is_superuser

        let METHOD = "POST"
        let URL = API_ENDPOINTS.USERS
        const extra_headers: any = {}

        if (updating) {
            METHOD = "PUT"
            URL = `${URL}/${data?.id}`
            data_.id = data.id
            delete data_.user?.password
            delete data_.user?.password_repeat
            // delete data_.user?.username
            delete data_.user?.email
            extra_headers['Authorization'] = `Bearer ${token}`
        }

        makeRequestOne({ url: `${URL}`, method: METHOD, data: { ...data_.user }, useNext: false, extra_headers }).then((res: any) => {
            showNotification({
                title: "User Account",
                message: updating ? "User account updated successfully" : "Registration successful",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            if (!updating) {
                form.reset()
            }
            mutate && mutate()
        }).catch(error => {
            showNotification({
                title: "User Account",
                message: error?.message,
                color: "red",
                icon: <IconAlertTriangle stroke={1.5} />
            })
            const error_data = error?.response?.data
            console.log("Error: ", error_data)
            if (typeof (error_data) === 'object') {
                displayErrors(form, { user: error_data })
            }
        }).finally(() => {
            setLoading(false)
        })
    }
    return (
        <form onSubmit={form.onSubmit((_values: any) => { handleSubmit() })}>
            <Stack gap={20}>
                {
                    !hideTitle ? (
                        <>
                            <Title order={2} fw={500} ta={'center'}>User Account Creation</Title>
                            <Text ta={'center'} c={'dimmed'}>Create a new user account</Text>
                        </>
                    ) : null
                }
                <CreateUserFormJustInputs form={form} key={`user`} updating={!!updating}>
                    <CustomCol span={{ md: 6 }}>
                        <SelectCountryInput form={form} field_name={'user.profile.country'} />
                    </CustomCol>
                    {is_admin ? (
                        <>
                            <CustomCol span={{ md: 12 }}>
                                <Title order={3} fw={500}>Admin Information</Title>
                            </CustomCol>
                            <CustomCol span={{ md: 6 }}>
                                <Stack className='h-100' justify='center'>
                                    <Switch
                                        defaultChecked
                                        label="I am an admin"
                                        {...form.getInputProps('user.is_superuser', { type: 'checkbox' })}
                                    />
                                </Stack>
                            </CustomCol>
                            <CustomCol span={{ md: 6 }}>
                                <Stack className='h-100' justify='center'>
                                    <Switch
                                        defaultChecked
                                        label="I am active"
                                        {...form.getInputProps('user.is_active', { type: 'checkbox' })}
                                    />
                                </Stack>
                            </CustomCol>
                        </>
                    ) :
                        null
                    }

                </CreateUserFormJustInputs>
                <Group justify="center" style={{ textAlign: "center" }}>
                    <Button radius={'md'} loading={loading} rightSection={<IconUserPlus size={16} />} type='submit' >
                        {
                            updating ? "Update User" : "Register User"
                        }
                    </Button>
                </Group>
                {
                    !updating ? (
                        <Center >
                            <Anchor component={Link} href={'/auth/login'} size="sm" style={{ fontWeight: 400 }} >Already have an account? Login</Anchor>
                        </Center>
                    ) : null
                }
            </Stack>

        </form>
    )
}

export default CreateUserForm