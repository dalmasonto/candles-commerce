import AdminWrapper from '@/layouts/AdminWrapper'
import requireAuthMiddleware from '@/middleware/requireAuthMiddleware'
import CreateProductForm from '@/components/forms/CreateProductForm'
import { Stack, Title, Paper } from '@mantine/core'

interface ICategory {
  id: number
  name: string
}

interface IProductForm {
  name: string
  description: string
  price: number
  sale_price: number | null
  category_id: number | string
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

  return (
    <div>
      <Stack>
        <Title>Create Product</Title>
        <Paper withBorder p="md">
          <CreateProductForm updating={false} data={null} is_admin={true} />
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