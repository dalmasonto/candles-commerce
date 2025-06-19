import { makeRequestOne } from "@/config/config";
import { API_ENDPOINTS } from "@/config/constants";
import { displayErrors } from "@/config/functions";
import { useAppContext } from "@/providers/appProvider";
import { Button, Group, Loader, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconAlertTriangle, IconLogin } from "@tabler/icons-react";
import { useState } from "react";


interface ICreateCountryForm {
    data?: any
    updating?: boolean
    mutate?: any
}

const CreateCountryForm = (props: ICreateCountryForm) => {
    const { data, updating, mutate } = props
    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()

    const form = useForm({
        initialValues: {
            name: updating ? data?.name : ""
        },
        validate: {
            name: val => val === "" ? "Country name is required" : null
        }
    })

    const handleSubmit = () => {
        setLoading(true)
        const data_ = JSON.parse(JSON.stringify(form.values))
        let METHOD = "POST"
        let URL = API_ENDPOINTS.COUNTRIES

        if (updating) {
            METHOD = "PUT"
            URL = `${URL}/${data?.id}`
        }

        makeRequestOne({ url: `${URL}`, method: METHOD, data: data_, useNext: false, extra_headers: {
            Authorization: `Bearer ${token}`
        } }).then((res: any) => {
            showNotification({
                title: "Country",
                message: updating ? "Country updated successfully" : "Country creation successfully",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            if(!updating){
                form.reset()
            }
            mutate && mutate()
        }).catch(error => {
            showNotification({
                title: "Country",
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
                    <TextInput label="Country Name" {...form.getInputProps('name')} radius={'md'} placeholder="Kenya" />
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

export default CreateCountryForm