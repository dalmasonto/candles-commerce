import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { displayErrors } from '@/config/functions'
import { ICategory } from '@/config/types'
import { useAppContext } from '@/providers/appProvider'
import { Stack, TextInput, Button, Grid, Textarea, FileInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications, showNotification } from '@mantine/notifications'
import { IconAlertCircle, IconAlertTriangle } from '@tabler/icons-react'
import React, { useState } from 'react'
import SelectEcommerceCategoriesInput from '../common/SelectEcommerceCategoriesInput'

interface ICreateEcommerceCategoryForm {
    updating?: boolean
    data?: any
    mutate?: any
    is_admin?: boolean
    hideTitle?: boolean
}

const CreateEcommerceCategoryForm = (props: ICreateEcommerceCategoryForm) => {
    const { updating, data, mutate } = props

    const { token } = useAppContext()
    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            name: updating ? data?.name : '',
            description: updating ? data?.description : '',
            parent: updating ? data?.parent : null,
            image: updating ? data?.image : null,
        },
        validate: {
            name: (value) => (!value ? 'Name is required' : null)
        }
    })

    const handleSubmit = (values: any) => {
        setLoading(true)
        const data_ = form.values
        let METHOD = "POST"
        let URL = API_ENDPOINTS.ECOMMERCE_CATEGORIES
        let contentType = "application/json"
        if (data_.image && data_.image instanceof File) {
            contentType = "multipart/form-data"
        }

        if (updating) {
            METHOD = "PUT"
            URL = `${URL}/${data?.id}`
        }

        makeRequestOne({
            url: `${URL}`, method: METHOD, data: data_, useNext: false, extra_headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': contentType
            }
        }).then((res: any) => {
            showNotification({
                title: "Category",
                message: updating ? "Category updated successfully" : "Category creation successfully",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            if (!updating) {
                form.reset()
            }
            mutate && mutate()
        }).catch(error => {
            showNotification({
                title: "Category",
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
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Grid>
                <Grid.Col span={{ md: 12 }}>
                    <TextInput
                        label="Name"
                        radius={"md"}
                        placeholder="Enter category name"
                        required
                        {...form.getInputProps('name')}
                    />
                </Grid.Col>
                <Grid.Col span={{ md: 12 }}>
                    <Textarea
                        rows={4}
                        radius={"md"}
                        label="Description"
                        placeholder="Enter category description"
                        {...form.getInputProps('description')}
                    />
                </Grid.Col>
                <Grid.Col>
                    <SelectEcommerceCategoriesInput form={form} field_name="parent" multiple={false} size="md" />
                </Grid.Col>
                <Grid.Col span={{ md: 12 }}>
                    <FileInput
                        label="Image"
                        radius="md"
                        placeholder="Upload category image"
                        description={`Upload category image. ${updating ? "Image will not be updated if not selected" : ""}`}
                        {...form.getInputProps('image')}
                    />
                </Grid.Col>
                <Grid.Col span={{ md: 12 }}>
                    <Button
                        type="submit"
                        loading={loading}
                    >
                        Create Category
                    </Button>
                </Grid.Col>
            </Grid>
        </form>
    )
}

export default CreateEcommerceCategoryForm