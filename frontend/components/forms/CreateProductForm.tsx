import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { displayErrors } from '@/config/functions'
import { Anchor, Button, Center, FileInput, Grid, Group, Image, Indicator, SimpleGrid, Stack, Switch, Text, Textarea, TextInput, Title, useMantineColorScheme } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconAlertCircle, IconAlertTriangle, IconPencil, IconPlus, IconUserPlus } from '@tabler/icons-react'
import Link from 'next/link'
import React, { useState } from 'react'
import CreateUserFormJustInputs from './more_forms/CreateUserFormJustInputs'
import SelectCountryInput from '../common/SelectCountryInput'
import { useAppContext } from '@/providers/appProvider'
import { IProduct } from '@/config/types'
import SelectCategoriesInput from '../common/SelectCategoriesInput'
import SelectEcommerceCategoriesInput from '../common/SelectEcommerceCategoriesInput'

const CustomCol = (props: any) => {
    const { children, ...rest } = props
    return (
        <Grid.Col {...rest}>
            {children}
        </Grid.Col>
    )
}

interface ICreateProductForm {
    updating?: boolean
    data?: any
    mutate?: any
    is_admin?: boolean
    hideTitle?: boolean
}


interface IForm {
    [key: string]: any
}

const CreateProductForm = (props: ICreateProductForm) => {
    const { updating, data, mutate, is_admin, hideTitle } = props
    const { colorScheme } = useMantineColorScheme()
    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()

    const form = useForm<IForm>({
        initialValues: {
            name: updating ? data?.name : '',
            slug: updating ? data?.slug : '',
            description: updating ? data?.description : '',
            top_notes: updating ? data?.top_notes : '',
            middle_notes: updating ? data?.middle_notes : '',
            base_notes: updating ? data?.base_notes : '',
            price: updating ? data?.price : 0.0,
            sale_price: updating ? data?.sale_price : 0.0,
            category_id: updating ? data?.category.id.toString() : '',
            stock: updating ? data?.stock : 0,
            is_active: updating ? data?.is_active : true,
            _images: []
        },

        validate: {
            name: (value) => (!value ? 'Name is required' : null),
            price: (value) => (value <= 0 ? 'Price must be greater than 0' : null),
            sale_price: (value, values) => (value && value > values.price ? 'Sale price cannot be greater than price' : null),
            category_id: (value) => (!value ? 'Category is required' : null),
            stock: (value) => (value <= 0 ? 'Stock cannot be less than or equal to 0' : null),
            top_notes: (value) => (!value ? 'Top notes is required' : null),
            middle_notes: (value) => (!value ? 'Middle notes is required' : null),
            base_notes: (value) => (!value ? 'Base notes is required' : null),
        },
    });

    const handleSubmit = (values: IProduct) => {
        console.log("Here")
        setLoading(true)
        const formData = new FormData()

        // Append all form fields to FormData
        Object.entries(values).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === '_images') {
                    values._images.forEach((file) => {
                        formData.append('_images', file)
                    })
                } else if (key === 'category_id') {
                    formData.append('category_id', value.toString())
                } else {
                    formData.append(key, value.toString())
                }
            }
        })

        let URL = API_ENDPOINTS.ECOMMERCE_PRODUCTS
        let METHOD = 'POST'

        if (updating) {
            URL = `${URL}/${data?.id}`
            METHOD = 'PUT'
        }

        makeRequestOne({
            url: URL,
            method: METHOD,
            data: formData,
            extra_headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                showNotification({
                    title: 'Success',
                    message: updating ? 'Product updated successfully' : 'Product created successfully',
                    color: 'green'
                })
            })
            .catch((err: any) => {
                showNotification({
                    title: 'Error',
                    message: err?.response?.data?.message || (updating ? 'Failed to update product' : 'Failed to create product'),
                    color: 'red'
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const getImageUrlfromFile = (file: File) => {
        return URL.createObjectURL(file)
    }

    const deleteImage = (id: number) => {
        makeRequestOne({
            url: `${API_ENDPOINTS.ECOMMERCE_PRODUCT_IMAGES}/${id}`,
            method: 'DELETE',
            extra_headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                showNotification({
                    title: 'Success',
                    message: 'Image deleted successfully',
                    color: 'green'
                })
            })
            .catch((err: any) => {
                showNotification({
                    title: 'Error',
                    message: err?.response?.data?.message || 'Failed to delete image',
                    color: 'red'
                })
            })
    }

    const radius = "md"

    return (
        <form onSubmit={form.onSubmit((values: any) => handleSubmit(values))}>
            <Stack>
                {
                    !hideTitle ? (
                        <Stack>
                            <Title order={2} fw={500} ta={'center'}>New Product</Title>
                            <Text ta={'center'} c={'dimmed'}>Create a new product</Text>
                        </Stack>
                    ) : null
                }

                <Grid>
                    <Grid.Col span={{ base: 6 }}>
                        <TextInput
                            label="Name"
                            placeholder="Enter product name"
                            radius={radius}
                            {...form.getInputProps('name')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 6 }}>
                        <TextInput
                            label="Slug"
                            placeholder="Enter product slug"
                            disabled
                            radius={radius}
                            {...form.getInputProps('slug')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                        <Textarea
                            label="Description"
                            placeholder="Enter product description"
                            rows={5}
                            radius={radius}
                            {...form.getInputProps('description')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                        <Textarea
                            label="Top Notes"
                            placeholder="Enter top notes"
                            radius={radius}
                            rows={2}
                            {...form.getInputProps('top_notes')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                        <Textarea
                            label="Middle Notes"
                            placeholder="Enter middle notes"
                            radius={radius}
                            rows={2}
                            {...form.getInputProps('middle_notes')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                        <Textarea
                            label="Base Notes"
                            placeholder="Enter base notes"
                            radius={radius}
                            rows={2}
                            {...form.getInputProps('base_notes')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 6 }}>
                        <TextInput
                            label="Price"
                            placeholder="Enter price"
                            description="Enter price of the product"
                            radius={radius}
                            {...form.getInputProps('price')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 6 }}>
                        <TextInput
                            label="Sale Price"
                            placeholder="Enter sale price"
                            description="Enter sale price if the product is on sale"
                            radius={radius}
                            {...form.getInputProps('sale_price')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 6 }}>
                        <SelectEcommerceCategoriesInput
                            form={form}
                            field_name="category_id"
                            multiple={false}
                            size="lg"
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 6 }}>
                        <TextInput
                            label="Stock"
                            placeholder="Enter stock"
                            radius={radius}
                            {...form.getInputProps('stock')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 6 }}>
                        <Switch
                            label="Is Active"
                            description="Toggle to activate the product"
                            radius={radius}
                            {...form.getInputProps('is_active', { type: 'checkbox' })}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                        <FileInput
                            label="Images"
                            description="Select product Images. When updating, only select new images."
                            placeholder="Upload images"
                            accept='image/*'
                            multiple
                            radius={radius}
                            {...form.getInputProps('_images')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                        <SimpleGrid cols={{ base: 2, md: 3, lg: 4 }}>
                            {
                                form.values._images.map((image: File, index: number) => (
                                    <Indicator inline label="New - Delete" size={16}
                                        onClick={() => form.removeListItem('_images', index)}
                                        style={{ cursor: 'pointer' }} color='red'>
                                        <Image
                                            src={getImageUrlfromFile(image)}
                                            alt={`Image ${index + 1}`}
                                            width={100}
                                            height={100}
                                            radius={radius}
                                            key={index}
                                        />
                                    </Indicator>
                                ))
                            }
                            {
                                data?.images.map((image: any, index: number) => (
                                    <Indicator inline label="Existing - Delete" size={16}
                                        onClick={() => deleteImage(image.id)}
                                        style={{ cursor: 'pointer' }} color='red'>
                                        <Image
                                            src={image.image}
                                            alt={`Image ${index + 1}`}
                                            width={100}
                                            height={100}
                                            radius={radius}
                                            key={index}
                                        />
                                    </Indicator>
                                ))
                            }
                        </SimpleGrid>
                    </Grid.Col>
                </Grid>

                <Group justify="center" style={{ textAlign: "center" }}>
                    <Button radius={'md'} loading={loading} rightSection={updating ? <IconPencil size={16} /> : <IconPlus size={16} />} type='submit' >
                        {
                            updating ? "Update Product" : "Create Product"
                        }
                    </Button>
                </Group>
            </Stack>
        </form>
    )
}

export default CreateProductForm