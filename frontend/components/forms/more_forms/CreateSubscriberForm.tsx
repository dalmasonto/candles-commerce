import { makeRequestOne } from "@/config/config";
import { API_ENDPOINTS } from "@/config/constants";
import { displayErrors } from "@/config/functions";
import { useAppContext } from "@/providers/appProvider";
import { Button, Group, Loader, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconAlertTriangle, IconArticle } from "@tabler/icons-react";
import { useState } from "react";


interface ICreateSubscriberForm {
    data?: any
    updating?: boolean
    mutate?: any
    label?: string
    buttonLabel?: string
}

const CreateSubscriberForm = (props: ICreateSubscriberForm) => {
    const { data, updating, mutate, label, buttonLabel } = props
    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()

    const form = useForm({
        initialValues: {
            email: updating ? data?.email : ""
        },
        validate: {
            email: val => val === "" ? "Subscriber Email is required" : null
        }
    })

    const handleSubmit = () => {
        setLoading(true)
        const data_ = JSON.parse(JSON.stringify(form.values))
        let METHOD = "POST"
        let URL = API_ENDPOINTS.SUBSCRIBERS

        if (updating) {
            METHOD = "PUT"
            URL = `${URL}/${data?.id}`
        }

        makeRequestOne({
            url: `${URL}`, method: METHOD, data: data_, useNext: false, extra_headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res: any) => {
            showNotification({
                title: "Subscriber",
                message: updating ? "Subscriber updated successfully" : "Subscriber creation successfully",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            if (!updating) {
                form.reset()
            }
            mutate && mutate()
        }).catch(error => {
            showNotification({
                title: "Subscriber",
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
                    <TextInput label={label ? label : "Subscriber Email"} {...form.getInputProps('email')} radius={'md'} placeholder="johndoe@gmail.com" />
                    <Group justify="center" style={{ textAlign: "center" }}>
                        <Button radius={'md'} rightSection={loading ? <Loader color='white' size={16} /> : <IconArticle size={16} />} type='submit' >
                            {updating ? "Update" : buttonLabel ?? "Create"}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </div>
    )
}

export default CreateSubscriberForm