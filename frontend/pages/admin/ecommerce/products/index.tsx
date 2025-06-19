import { makeRequestOne, toDate } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import AdminWrapper from '@/layouts/AdminWrapper'
import requireAuthMiddleware from '@/middleware/requireAuthMiddleware'
import { useAppContext } from '@/providers/appProvider'
import { ActionIcon, Badge, Box, Button, Group, Image, Paper, Stack, Table, Text, TextInput, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import CustomDataTable from '@/components/tables/filters/CustomDataTable'
import CreateProductForm from '@/components/forms/CreateProductForm'
import { formatCurrency } from '@/config/functions'

interface IProduct {
  id: number
  name: string
  slug: string
  price: number
  sale_price: number | null
  stock: number
  sku: string
  is_active: boolean
  category: {
    id: number
    name: string
  }
}

const ProductsPage = () => {
  const { token } = useAppContext()
  const router = useRouter()
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const loadProducts = () => {
    setLoading(true)
    makeRequestOne({
      url: API_ENDPOINTS.ECOMMERCE_PRODUCTS,
      method: 'GET',
      extra_headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res: any) => {
      setProducts(res?.data?.results || [])
    }).catch((err: any) => {
      console.error(err)
      notifications.show({
        title: 'Error',
        message: 'Failed to load products',
        color: 'red'
      })
    }).finally(() => {
      setLoading(false)
    })
  }

  const deleteProduct = (id: number) => {
    makeRequestOne({
      url: `${API_ENDPOINTS.ECOMMERCE_PRODUCTS}/${id}`,
      method: 'DELETE',
      extra_headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
      notifications.show({
        title: 'Success',
        message: 'Product deleted successfully',
        color: 'green'
      })
      loadProducts()
    }).catch((err: any) => {
      console.error(err)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete product',
        color: 'red'
      })
    })
  }

  const confirmDelete = (id: number) => {
    modals.openConfirmModal({
      title: 'Delete Product',
      children: (
        <Text size="sm">
          Are you sure you want to delete this product? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteProduct(id)
    })
  }

  useEffect(() => {
    loadProducts()
  }, [token])

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <Stack>
        <Group justify="space-between">
          <Stack gap={2}>
            <Title>Products</Title>
            <Text size="sm" c="dimmed">Manage your store products</Text>
          </Stack>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => router.push('/admin/ecommerce/products/create')}
          >
            Add Product
          </Button>
        </Group>
        <CustomDataTable
          url={API_ENDPOINTS.ECOMMERCE_PRODUCTS}
          method={'GET'}
          defaultFilters={{
            page: 1,
            limit: '10',
            ordering: 'id',
            search: "",
            // fields: "id,name,description,created_at,modified_at"
          }}
          useNext={false}
          formValidators={undefined}
          hideUpdateActionBtn={false}
          updateData={{
            formNode: CreateProductForm,
            extraFormProps: {
              hideTitle: true
            },
            modalSize: 'lg',
            updatingModalTitle: "Update Product",
            deletingModalTitle: "Delete Product"
          }}
          columns={[
            {
              accessor: 'id',
              title: 'ID',
              width: '40px'
            },
            {
              accessor: "name",
              title: "Name",
              width: "200px",
              render: (item: any) => (
                <Group>
                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={item.images[0]?.cloudinary_url}
                      width={50}
                      maw={50}
                      height={50}
                      radius="md"
                      alt={item.name}
                    />
                  ): null}
                  <Text size="sm">{item?.name}</Text>
                </Group>
              )
            },
            {
              accessor: "stock",
              title: "Stock",
              width: "100px",
            },
            {
              accessor: "category.name",
              title: "Category",
              width: "100px",
            },
            {
              accessor: "price",
              title: "Price",
              width: "100px",
              render: (item: any) => (
                <Text size="sm">{formatCurrency(item?.price)}</Text>
              )
            },
            {
              accessor: "is_active",
              title: "Status",
              width: "100px",
              render: (item: any) => (
                <Badge
                  variant={item.is_active ? 'filled' : 'outline'}
                  color={item.is_active ? 'green' : 'red'}
                >
                  {item.is_active ? 'Active' : 'Inactive'}
                </Badge>
              )
            },
            {
              accessor: 'created_on',
              title: 'Created On',
              width: '120px',
              render: (item: any) => (
                <Text size='sm'>{toDate(item?.created_on, true)}</Text>
              )
            },
            {
              accessor: 'updated_on',
              title: 'Modified On',
              width: '120px',
              render: (item: any) => (
                <Text size='sm'>{toDate(item?.updated_on, true)}</Text>
              )
            }
          ]}
          filterFields={[
            {
              accessor: 'limit',
              label: 'Limit',
              gridSize: 2,
              placeholder: '23',
              type: 'select',
              options: [
                { value: '2', label: '2' },
                { value: '5', label: '5' },
                { value: '10', label: '10' },
                { value: '15', label: '15' },
                { value: '20', label: '20' },
                { value: '50', label: '50' },
                { value: '100', label: '100' },
              ]
            },
            {
              accessor: 'search',
              label: 'Search',
              gridSize: 2,
              placeholder: 'Search by code',
              type: 'text'
            },
            {
              accessor: 'ordering',
              label: 'Ordering',
              gridSize: 2,
              placeholder: '23',
              type: 'select',
              options: [
                {
                  group: 'Ascending',
                  items: [
                    { value: 'id', label: 'ID' },
                    { value: 'code', label: 'Code' },
                  ]
                },
                {
                  group: 'Descending',
                  items: [
                    { value: '-id', label: 'ID' },
                    { value: '-code', label: 'Code' },
                  ]
                }
              ]
            },
          ]}
        />

        {/* <Paper withBorder p="md">
          <Stack>
            <TextInput
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Box>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>SKU</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Stock</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredProducts.map((product) => (
                    <Table.Tr key={product.id}>
                      <Table.Td>{product.name}</Table.Td>
                      <Table.Td>{product.sku}</Table.Td>
                      <Table.Td>{product.category.name}</Table.Td>
                      <Table.Td>
                        {product.sale_price ? (
                          <Group gap={4}>
                            <Text td="line-through" c="dimmed">${product.price}</Text>
                            <Text c="green">${product.sale_price}</Text>
                          </Group>
                        ) : (
                          <Text>${product.price}</Text>
                        )}
                      </Table.Td>
                      <Table.Td>{product.stock}</Table.Td>
                      <Table.Td>
                        <Badge color={product.is_active ? 'green' : 'red'}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => router.push(`/admin/ecommerce/products/edit/${product.id}`)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => confirmDelete(product.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Box>
          </Stack>
        </Paper>
        */}
        
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

ProductsPage.PageLayout = AdminWrapper

export default ProductsPage 