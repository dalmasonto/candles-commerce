import { makeRequestOne } from "@/config/config";
import { API_ENDPOINTS } from "@/config/constants";
import { displayErrors } from "@/config/functions";
import { useAppContext } from "@/providers/appProvider";
import { Button, Grid, Group, Loader, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconAlertTriangle, IconLogin } from "@tabler/icons-react";
import { useState } from "react";


interface ICreateAPIKeyForm {
    data?: any
    updating?: boolean
    mutate?: any
}

const CreateAPIKeyForm = (props: ICreateAPIKeyForm) => {
    const { data, updating, mutate } = props
    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()

    const form = useForm({
        initialValues: {
            name: updating ? data?.name : "",
            domain: updating ? data?.domain : "",
        },
        validate: {
            name: val => val === "" ? "API Key name is required" : null,
            domain: val => val === "" ? "Domain name is required" : null,
        }
    })

    const handleSubmit = () => {
        setLoading(true)
        const data_ = JSON.parse(JSON.stringify(form.values))
        let METHOD = "POST"
        let URL = API_ENDPOINTS.CREATE_API_KEY

        if (updating) {
            METHOD = "PUT"
            URL = `${URL}/${data?.id}`
        }

        makeRequestOne({
            url: `${URL}`, method: METHOD, data: data_, extra_headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res: any) => {
            showNotification({
                title: "API Key",
                message: updating ? "API Key updated successfully" : "API Key creation successfully",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            if (!updating) {
                form.reset()
            }
            mutate && mutate()
        }).catch(error => {
            showNotification({
                title: "API Key",
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
            <form onSubmit={form.onSubmit(_ => handleSubmit())}>
                <Stack gap={10}>
                    <Grid>
                        <Grid.Col span={12}>
                            <TextInput label="API Key Name" {...form.getInputProps('name')} radius={'md'} placeholder="Tokenkit Sepolia" />
                        </Grid.Col>
                    </Grid>
                    <TextInput label="Domain" description="The domain that will be using this API Key to make calls" {...form.getInputProps('domain')} radius={'md'} placeholder="https://sepolia.token-kit.io" />
                    <Group justify="center" style={{ textAlign: "center" }}>
                        <Button radius={'md'} rightSection={loading ? <Loader color='white' size={16} /> : <IconLogin size={16} />} type='submit' >
                            {updating ? "Update" : "Create"}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </div>
    )
}

export default CreateAPIKeyForm