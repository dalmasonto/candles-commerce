import { makeRequestOne } from "@/config/config"
import { API_ENDPOINTS } from "@/config/constants"
import { displayErrors } from "@/config/functions"
import { Grid, Stack, TextInput, PasswordInput, Group, Center } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { IconAlertCircle, IconAlertTriangle, IconUser, IconMail, IconPassword } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"



const CustomCol = (props: any) => {
    const { children, md } = props
    return (
        <Grid.Col span={{ md: 6 }}>
            {children}
        </Grid.Col>
    )
}

const AddUserForm = () => {

    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const form: any = useForm({
        initialValues: {
            first_name: "",
            last_name: "",
            username: "",
            password: "",
            password_repeat: "",
            email: "",
            profile: {
                gender: ''
            }
        },

        validate: {
            first_name: (value) => (value === "" || value === null || value === undefined) ? "First name is required" : null,
            last_name: (value) => (value === "" || value === null || value === undefined) ? "Last name is required" : null,
            email: (value) => (value === "" || value === null || value === undefined) ? "Email is required" : null,
            username: (value) => (value === "" || value === null || value === undefined) ? "Username is required" : null,
            password: (value) => {
                if (value === "") {
                    return "Password is required"
                }
                else if (value !== form.values["password_repeat"]) {
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
                else if (value !== form.values["password_repeat"]) {
                    return "Passwords do not match"
                }
                else {
                    return null
                }
            },
            profile: {
                gender: val => val === '' ? "Gender is required" : null
            }
        },
    });

    const handleSubmit = () => {
        setLoading(true)
        const data_ = JSON.parse(JSON.stringify(form.values))
        delete data_["password_repeat"];

        makeRequestOne({ url: `${API_ENDPOINTS.REGISTER}`, method: "POST", data: data_, useNext: false }).then((res: any) => {
            showNotification({
                title: "Account creation",
                message: "Signup successful",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            router.push('/auth/login')
        }).catch(error => {
            showNotification({
                title: "Account creation",
                message: error?.message,
                color: "red",
                icon: <IconAlertTriangle stroke={1.5} />
            })
            const error_data = error?.response?.data
            if (typeof (error_data) === 'object') {
                displayErrors(form, error_data)
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div>
            <form onSubmit={form.onSubmit((_values: any) => { handleSubmit() })}>
                <Stack gap={6}>
                    <Grid>
                        <CustomCol span={{ md: 6 }}>
                            <TextInput leftSection={<IconUser size={16} />} radius="md" label="First Name" {...form.getInputProps('first_name')} placeholder='Enter first name' />
                        </CustomCol>
                        <CustomCol span={{ md: 6 }}>
                            <TextInput leftSection={<IconUser size={16} />} radius="md" label="Last Name" {...form.getInputProps('last_name')} placeholder='Enter last name' />
                        </CustomCol>
                        <CustomCol span={{ md: 6 }}>
                            <TextInput leftSection={<IconMail size={16} />} radius="md" label="Email" {...form.getInputProps('email')} placeholder='Enter email' />
                        </CustomCol>
                        <CustomCol span={{ md: 6 }}>
                            <TextInput leftSection={<IconUser size={16} />} radius="md" label="Username" {...form.getInputProps('username')} placeholder='Enter username' />
                        </CustomCol>
                        <CustomCol span={{ md: 6 }}>
                            <PasswordInput leftSection={<IconPassword size={16} />} size='sm' radius="md" label="Password" {...form.getInputProps('password')} placeholder="Enter password" />
                        </CustomCol>
                        <CustomCol span={{ md: 6 }}>
                            <PasswordInput leftSection={<IconPassword size={16} />} size='sm' radius="md" label="Repeat Password" {...form.getInputProps('password_repeat')} placeholder="Repeat password" />
                        </CustomCol>
                    </Grid>
                    <Group mt="sm" justify="center" style={{ textAlign: "center" }}>
                        {/* <Button size='sm' type="submit" radius="xl" style={{ width: "120px" }} rightSection={loading ? <Loader color='violet' size={22} /> : <IconUserPlus color="white" />}>Sign Up</Button> */}
                        {/* <BlueButton btnDetails={{
                            label: "Sign Up",
                            endIcon: loading ? <Loader color='violet' size={22} /> : <IconUserPlus color="white" />,
                            type: "submit"
                        }} /> */}
                    </Group>
                    <Center mt="sm">
                        <Link href="/auth/login" passHref>
                            {/* <Text component='a' size="sm" >
                                Already have an account?
                                <span style={{
                                    color: THEME_COLORS.primaryColorAccent,
                                    marginLeft: "4px"
                                }}>
                                    Login
                                </span>
                            </Text> */}
                        </Link>
                    </Center>
                </Stack>

            </form>
        </div>
    )
}

export default AddUserForm