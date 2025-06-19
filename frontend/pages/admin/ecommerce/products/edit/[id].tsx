import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import AdminWrapper from '@/layouts/AdminWrapper'
import requireAuthMiddleware from '@/middleware/requireAuthMiddleware'
import { useAppContext } from '@/providers/appProvider'
import { Button, FileInput, Group, NumberInput, Paper, Select, Stack, Switch, TextInput, Textarea, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { notifications } from '@mantine/notifications'

interface ICategory {
  id: number
  name: string
}

interface IProductForm {
  name: string
  description: string
  price: number
  sale_price: number | null
  category_id: number
  stock: number
  sku: string
  is_active: boolean
  weight: number | null
  dimensions: string
  fragrance_notes: string
  burn_time: string
  materials: string
  images: File[]
}

const ProductForm = () => {
  const { token } = useAppContext()
  const router = useRouter()
  const { id } = router.query
  const [categories, setCategories] = useState<ICategory[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<IProductForm>({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      sale_price: null,
      category_id: 0,
      stock: 0,
      sku: '',
      is_active: true,
      weight: null,
      dimensions: '',
      fragrance_notes: '',
      burn_time: '',
      materials: '',
      images: []
    },
    validate: {
      name: (value) => (!value ? 'Name is required' : null),
      price: (value) => (value <= 0 ? 'Price must be greater than 0' : null),
      category_id: (value) => (!value ? 'Category is required' : null),
      stock: (value) => (value < 0 ? 'Stock cannot be negative' : null),
      sku: (value) => (!value ? 'SKU is required' : null),
    }
  })

  const loadCategories = () => {
    makeRequestOne({
      url: API_ENDPOINTS.ECOMMERCE_CATEGORIES,
      method: 'GET',
      extra_headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res: any) => {
      setCategories(res?.data?.results || [])
    }).catch((err: any) => {
      console.error(err)
      notifications.show({
        title: 'Error',
        message: 'Failed to load categories',
        color: 'red'
      })
    })
  }

  const loadProduct = () => {
    if (id) {
      setLoading(true)
      makeRequestOne({
        url: `${API_ENDPOINTS.ECOMMERCE_PRODUCTS}/${id}`,
        method: 'GET',
        extra_headers: {
          Authorization: `Bearer ${token}`
        },
        useNext: false
      }).then((res: any) => {
        const product = res?.data
        form.setValues({
          name: product.name,
          description: product.description,
          price: product.price,
          sale_price: product.sale_price,
          category_id: product.category.id?.toString() || '',
          stock: product.stock,
          sku: product.sku,
          is_active: product.is_active,
          weight: product.weight,
          dimensions: product.dimensions,
          fragrance_notes: product.fragrance_notes,
          burn_time: product.burn_time,
          materials: product.materials,
          images: []
        })
      }).catch((err: any) => {
        console.error(err)
        notifications.show({
          title: 'Error',
          message: 'Failed to load product',
          color: 'red'
        })
      }).finally(() => {
        setLoading(false)
      })
    }
  }

  const handleSubmit = (values: IProductForm) => {
    setLoading(true)
    const formData = new FormData()
    
    // Append all form fields to FormData
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'images') {
          values.images.forEach((file) => {
            formData.append('images', file)
          })
        } else {
          formData.append(key, value.toString())
        }
      }
    })

    const request =  makeRequestOne({
          url: `${API_ENDPOINTS.ECOMMERCE_PRODUCTS}/${id}`,
          method: 'PUT',
          data: formData,
          extra_headers: {
            Authorization: `Bearer ${token}`
          },
          useNext: false
        })

    request
      .then(() => {
        notifications.show({
          title: 'Success',
          message: `Product ${id ? 'updated' : 'created'} successfully`,
          color: 'green'
        })
        router.push('/admin/ecommerce/products')
      })
      .catch((err: any) => {
        console.error(err)
        notifications.show({
          title: 'Error',
          message: `Failed to ${id ? 'update' : 'create'} product`,
          color: 'red'
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadCategories()
    if (id) {
      loadProduct()
    }
  }, [id, token])

  return (
    <div>
      <Stack>
        <Title>{id ? 'Edit Product' : 'Create Product'}</Title>
        <Paper withBorder p="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Name"
                placeholder="Enter product name"
                required
                {...form.getInputProps('name')}
              />
              <Textarea
                label="Description"
                placeholder="Enter product description"
                required
                minRows={3}
                {...form.getInputProps('description')}
              />
              <Group grow>
                <NumberInput
                  label="Price"
                  placeholder="Enter price"
                  required
                  min={0}
                  {...form.getInputProps('price')}
                />
                <NumberInput
                  label="Sale Price"
                  placeholder="Enter sale price"
                  min={0}
                  {...form.getInputProps('sale_price')}
                />
              </Group>
              <Group grow>
                <Select
                  label="Category"
                  placeholder="Select category"
                  required
                  data={categories.map(cat => ({
                    value: cat.id.toString(),
                    label: cat.name
                  }))}
                  {...form.getInputProps('category_id')}
                />
                <NumberInput
                  label="Stock"
                  placeholder="Enter stock quantity"
                  required
                  min={0}
                  {...form.getInputProps('stock')}
                />
              </Group>
              <TextInput
                label="SKU"
                placeholder="Enter SKU"
                required
                {...form.getInputProps('sku')}
              />
              <Group grow>
                <NumberInput
                  label="Weight (g)"
                  placeholder="Enter weight"
                  min={0}
                  {...form.getInputProps('weight')}
                />
                <TextInput
                  label="Dimensions"
                  placeholder="Enter dimensions (LxWxH)"
                  {...form.getInputProps('dimensions')}
                />
              </Group>
              <Textarea
                label="Fragrance Notes"
                placeholder="Enter fragrance notes"
                minRows={2}
                {...form.getInputProps('fragrance_notes')}
              />
              <Group grow>
                <TextInput
                  label="Burn Time"
                  placeholder="Enter burn time"
                  {...form.getInputProps('burn_time')}
                />
                <TextInput
                  label="Materials"
                  placeholder="Enter materials"
                  {...form.getInputProps('materials')}
                />
              </Group>
              <FileInput
                label="Product Images"
                placeholder="Upload product images"
                accept="image/*"
                multiple
                {...form.getInputProps('images')}
              />
              <Switch
                label="Active"
                {...form.getInputProps('is_active', { type: 'checkbox' })}
              />
              <Group justify="flex-end">
                <Button
                  variant="light"
                  onClick={() => router.push('/admin/ecommerce/products')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                >
                  {id ? 'Update' : 'Create'} Product
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  requireAuthMiddleware(context.req, context.res, () => { })
  return {
    props: {}
  }
}

ProductForm.PageLayout = AdminWrapper

export default ProductForm 