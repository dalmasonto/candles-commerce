import { makeRequestOne } from "@/config/config";
import { API_ENDPOINTS } from "@/config/constants";
import { displayErrors, loadMediaURL } from "@/config/functions";
import { useAppContext } from "@/providers/appProvider";
import { Avatar, Button, FileInput, Grid, Group, Image, Loader, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconAlertTriangle, IconLogin } from "@tabler/icons-react";
import { useEffect, useState } from "react";


interface IProfilePhotoForm {
    data?: any
    updating?: boolean
    mutate?: any
}

const ProfilePhotoForm = (props: IProfilePhotoForm) => {
    const { data, updating, mutate } = props
    const [loading, setLoading] = useState(false)
    const [userD, setUser] = useState<any>(null)
    const { token, user, user_id } = useAppContext()

    const form = useForm({
        initialValues: {
            avatar: ""
        },
        validate: {
            avatar: val => val === '' ? 'Profile photo is required' : null
        }
    })

    const handleSubmit = () => {
        const data_ = {
            user: user_id,
            avatar: form.values.avatar,
        }

        if (user?.profile) {
            setLoading(true)
            let METHOD = "PUT"
            let URL = `${API_ENDPOINTS.PROFILES}/${user?.profile?.id}`
            makeRequestOne({
                url: `${URL}`, method: METHOD, data: data_, useNext: false, extra_headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                params: {
                    fields: 'avatar'
                }
            }).then((res: any) => {
                showNotification({
                    title: "Profile Photo",
                    message: "Profile Photo changed successfully!",
                    color: "green",
                    icon: <IconAlertCircle stroke={1.5} />
                })
                if (!updating) {
                    form.reset()
                }
                mutate && mutate()
            }).catch(error => {
                showNotification({
                    title: "Profile Photo",
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
    }

    useEffect(() => {
        setUser(user)
    }, [])

    return (
        <div>
            <form onSubmit={form.onSubmit(_ => handleSubmit())}>
                <Stack gap={10}>
                    <Grid>
                        <Grid.Col span={{ md: 6 }}>
                            <Stack align="center" justify="center">
                                <Text ta={'center'}>Current</Text>
                                <Image fit="contain" w={'100px'} h={'100px'} bg={'rgba(0,0,0,0.1)'} radius={'50%'} src={loadMediaURL(userD?.profile?.avatar)} />
                            </Stack>
                        </Grid.Col>
                        <Grid.Col span={{ md: 6 }}>
                            <Stack className="h-100" justify="center">
                                <FileInput
                                    label="Select Profile Photo"
                                    placeholder='Avatar'
                                    accept="img/*"
                                    radius="md"
                                    {...form.getInputProps('avatar')}
                                    withAsterisk
                                />
                            </Stack>
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

export default ProfilePhotoForm