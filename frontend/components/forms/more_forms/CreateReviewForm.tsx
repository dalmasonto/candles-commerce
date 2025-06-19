import SelectUserInput from "@/components/common/SelectUserInput";
import { makeRequestOne } from "@/config/config";
import { API_ENDPOINTS } from "@/config/constants";
import { displayErrors } from "@/config/functions";
import { useAppContext } from "@/providers/appProvider";
import { Box, Button, Group, Loader, Rating, Stack, Switch, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconAlertTriangle, IconLogin } from "@tabler/icons-react";
import { useState } from "react";


interface ICreateReviewForm {
    data?: any
    updating?: boolean
    mutate?: any
}

const CreateReviewForm = (props: ICreateReviewForm) => {
    const { data, updating, mutate } = props
    const [loading, setLoading] = useState(false)
    const { token, user_id } = useAppContext()

    const form = useForm({
        initialValues: {
            review: updating ? data?.review : "",
            rating: updating ? data?.rating : 4,
            is_public: updating ? data?.is_public : false,
            user: updating ? data?.user?.id.toString() ?? '' : '',
            user_name: updating ? data?.user_name ?? '' : '',
        },
        validate: {
            user_name: val => val === "" ? "Enter Reviewer's name" : null,
            review: val => val === "" ? "Write your review!" : null
        }
    })

    const handleSubmit = () => {
        setLoading(true)
        const data_ = JSON.parse(JSON.stringify(form.values))
        let METHOD = "POST"
        let URL = API_ENDPOINTS.REVIEWS

        if (updating) {
            METHOD = "PUT"
            URL = `${URL}/${data?.id}`
        } else {
            data_.user = user_id
        }

        makeRequestOne({
            url: `${URL}`, method: METHOD, data: data_, useNext: false, extra_headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res: any) => {
            showNotification({
                title: "Crop",
                message: updating ? "Crop updated successfully" : "Crop creation successfully",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            if (!updating) {
                form.reset()
            }
            mutate && mutate()
        }).catch(error => {
            showNotification({
                title: "Crop",
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
                    <SelectUserInput form={form} field_name="user" />
                    <TextInput label="Reviewer's Name" radius={'md'} {...form.getInputProps('user_name')} placeholder="Reviewer's name" />
                    <Textarea label="Review" rows={6} {...form.getInputProps('review')} radius={'md'} placeholder="The services are dope!" />
                    <Box>
                        <Text fw={500} mb="sm">Rating</Text>
                        <Rating {...form.getInputProps('rating')} color="orange" />
                    </Box>
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

export default CreateReviewForm