import { makeRequestOne } from "@/config/config";
import { API_ENDPOINTS } from "@/config/constants";
import { displayErrors } from "@/config/functions";
import { useAppContext } from "@/providers/appProvider";
import { Button, Grid, Group, Loader, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconAlertTriangle, IconLogin } from "@tabler/icons-react";
import { useState } from "react";


interface IChangePasswordForm {
    data?: any
    updating?: boolean
    mutate?: any
}

const ChangePasswordForm = (props: IChangePasswordForm) => {
    const { data, updating, mutate } = props
    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()

    const form = useForm({
        initialValues: {
            old_password: "",
            new_password: "",
            repeat_password: "",
        },
        validate: {
            old_password: val => val === "" ? "Old Password is required" : null,
            new_password: (pass, { old_password }) => {
                if (pass === "") {
                    return "Old Password is required"
                }
                else if (pass === old_password) {
                    return "New password can't match old password"
                }
                return null
            },
            repeat_password: (pass, { new_password }) => {
                if (pass === '') {
                    return "Repeat new password"
                }
                else if (pass !== new_password) {
                    return "Repeat password does not match with new password"
                }
                return null
            },
        }
    })

    const handleSubmit = () => {
        setLoading(true)
        const data_ = {
            old_password: form.values.old_password,
            new_password: form.values.new_password
        }
        let METHOD = "PUT"
        let URL = API_ENDPOINTS.CHANGE_PASSWORD

        if (updating) {
            METHOD = "PUT"
            URL = `${URL}/${data?.id}`
        }

        makeRequestOne({
            url: `${URL}`, method: METHOD, data: data_, useNext: false, extra_headers: {
                authorization: `Bearer ${token}`
            }
        }).then((res: any) => {
            showNotification({
                title: "Password Change",
                message: "Password change successful",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            if (!updating) {
                form.reset()
            }
            mutate && mutate()
        }).catch(error => {
            showNotification({
                title: "Password Change",
                message: error?.message,
                color: "red",
                icon: <IconAlertTriangle stroke={1.5} />
            })
            const error_data = error?.response?.data
            console.log(error_data)
            if (typeof (error_data) === 'object') {
                displayErrors(form, error_data)
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div>
            <form onSubmit={form.onSubmit(_ => handleSubmit())}>
                <Stack gap={10}>
                    <Grid>
                        <Grid.Col span={{ md: 6 }}>
                            <TextInput
                                label="Old Password"
                                placeholder='Old Password'
                                radius="md"
                                {...form.getInputProps('old_password')}
                                withAsterisk
                            />
                        </Grid.Col>
                        <Grid.Col span={{ md: 6 }}>
                            <TextInput
                                label="New Password"
                                placeholder='New Password'
                                radius="md"
                                {...form.getInputProps('new_password')}
                                withAsterisk
                            />
                        </Grid.Col>
                        <Grid.Col span={{ md: 6 }}>
                            <TextInput
                                label="Repeat password"
                                placeholder='Repeat Password'
                                radius="md"
                                {...form.getInputProps('repeat_password')}
                                withAsterisk
                            />
                        </Grid.Col>
                    </Grid>
                    <Group justify="center" style={{ textAlign: "center" }}>
                        <Button radius={'md'} loading={loading} type='submit' >
                            Update
                        </Button>
                    </Group>
                </Stack>
            </form>
        </div>
    )
}

export default ChangePasswordForm