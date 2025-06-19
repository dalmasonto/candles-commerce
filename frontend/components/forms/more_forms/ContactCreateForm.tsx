import CustomCol from "@/components/common/CustomCol";
import { makeRequestOne } from "@/config/config";
import { API_ENDPOINTS } from "@/config/constants";
import { displayErrors } from "@/config/functions";
import { useAppContext } from "@/providers/appProvider";
import { Button, Grid, Group, Loader, Select, Stack, Switch, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconAlertTriangle, IconLogin } from "@tabler/icons-react";
import { useState } from "react";


interface IContactCreateForm {
    data?: any
    updating?: boolean
    mutate?: any
}

const ContactCreateForm = (props: IContactCreateForm) => {
    const { data, updating, mutate } = props
    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()

    const form = useForm({
        initialValues: {
            name: updating ? data?.name : "",
            email: updating ? data?.email : "",
            phone_no: updating ? data?.phone_nno : "",
            service: updating ? data?.service : "",
            other: updating ? data?.other : "",
            subject: updating ? data?.subject : "",
            message: updating ? data?.message : "",
            read: updating ? data?.read : false,
        },
        validate: {
            name: val => val === "" ? "Your name is required" : null,
            email: val => val === "" ? "Email is required" : null,
            phone_no: val => val === "" ? "Phone Number is required" : null,
            service: val => val === "" ? "Service is required" : null,
            subject: val => val === "" ? "Subject is required" : null,
            message: val => val === "" ? "Message is required" : null,
        }
    })

    const handleSubmit = () => {
        setLoading(true)
        const data_ = JSON.parse(JSON.stringify(form.values))
        let METHOD = "POST"
        let URL = API_ENDPOINTS.CONTACT_FORM

        if (updating) {
            METHOD = "PUT"
            URL = `${URL}/${data?.id}`
        }

        makeRequestOne({ url: `${URL}`, method: METHOD, data: data_, useNext: false }).then((res: any) => {
            showNotification({
                title: "CouContact Messagenty",
                message: updating ? "Contact Message updated successfully" : "Message Sent successfully",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            if (!updating) {
                form.reset()
            }
            mutate && mutate()
        }).catch(error => {
            showNotification({
                title: "Contact",
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
                        <Grid.Col span={{ md: 6 }}>
                            <TextInput
                                label="Full Name"
                                placeholder='Enter your full name'
                                radius="md"
                                {...form.getInputProps('name')}
                                withAsterisk
                            />
                        </Grid.Col>
                        <Grid.Col span={{ md: 6 }}>
                            <TextInput
                                label="Email"
                                placeholder='Enter your email address'
                                radius="md"
                                {...form.getInputProps('email')}
                                withAsterisk
                            />
                        </Grid.Col>
                        <Grid.Col span={{ md: 6 }}>
                            <TextInput
                                label="Phone Number"
                                placeholder='Enter your phone number'
                                radius="md"
                                {...form.getInputProps('phone_no')}
                                withAsterisk
                            />
                        </Grid.Col>
                        <Grid.Col span={{ md: 6 }}>
                            <Select label="Service" searchable
                                radius={'md'}
                                placeholder='Select your service'
                                data={[{
                                    value: 'other',
                                    label: "Other",
                                }]}
                                clearable
                                {...form.getInputProps('service')}
                                withAsterisk
                            />
                        </Grid.Col>
                        {
                            form.values.service === "other" && (
                                <Grid.Col span={{ md: 12 }}>
                                    <TextInput
                                        label="Other"
                                        placeholder='Enter your other service'
                                        radius="md"
                                        {...form.getInputProps('other')}
                                    />
                                </Grid.Col>
                            )
                        }
                        <Grid.Col span={{ md: 12 }}>
                            <TextInput
                                label="Subject"
                                placeholder='Enter your subject'
                                radius="md"
                                {...form.getInputProps('subject')}
                                withAsterisk
                            />
                        </Grid.Col>
                        <Grid.Col span={{ md: 12 }}>
                            <Textarea
                                minRows={10}
                                rows={5}
                                label="Message"
                                placeholder='Enter your message'
                                radius="md"
                                {...form.getInputProps('message')}
                                withAsterisk
                            />
                        </Grid.Col>
                        {
                            updating ? (
                                <CustomCol span={{ md: 6 }}>
                                    <Stack className='h-100' justify='center'>
                                        <Switch
                                            defaultChecked
                                            label="Is Read"
                                            {...form.getInputProps('read', { type: 'checkbox' })}
                                        />
                                    </Stack>
                                </CustomCol>
                            ) : null
                        }
                    </Grid>
                    <Group justify="center" style={{ textAlign: "center" }}>
                        <Button radius={'md'} rightSection={loading ? <Loader color='white' size={16} /> : <IconLogin size={16} />} type='submit' >
                            {updating ? "Update" : "Send Message"}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </div>
    )
}

export default ContactCreateForm