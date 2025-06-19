import { makeRequestOne } from "@/config/config";
import { API_ENDPOINTS } from "@/config/constants";
import { displayErrors } from "@/config/functions";
import { useAppContext } from "@/providers/appProvider";
import { Button, Group, Loader, Stack, Switch, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconAlertTriangle, IconLogin } from "@tabler/icons-react";
import { useState } from "react";


interface ICreateFAQForm {
    data?: any
    updating?: boolean
    mutate?: any
}

const CreateFAQForm = (props: ICreateFAQForm) => {
    const { data, updating, mutate } = props
    const [loading, setLoading] = useState(false)
    const { token, user_id } = useAppContext()

    const form = useForm({
        initialValues: {
            question: updating ? data?.question : "",
            answer: updating ? data?.answer : "",
            is_public: updating ? data?.is_public : true,
        },
        validate: {
            question: val => val === "" ? "Question is required" : null,
            answer: val => val === "" ? "Answer is required" : null,
        }
    })

    const handleSubmit = () => {
        setLoading(true)
        const data_ = JSON.parse(JSON.stringify(form.values))
        let METHOD = "POST"
        let URL = API_ENDPOINTS.FAQs

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
                title: "FAQ",
                message: updating ? "FAQ updated successfully" : "FAQ creation successfully",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            if (!updating) {
                form.reset()
            }
            mutate && mutate()
        }).catch(error => {
            showNotification({
                title: "FAQ",
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
                    <Textarea label="Question" rows={6} {...form.getInputProps('question')} radius={'md'} placeholder="Some Question" />
                    <Textarea label="Answer" rows={6} {...form.getInputProps('answer')} radius={'md'} placeholder="Answer to some question" />
                    <Switch label={'Is it public?'} {...form.getInputProps('is_public', {type: 'checkbox'})} />
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

export default CreateFAQForm