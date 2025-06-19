import React, { useState } from 'react'
import { Group, Stack, TextInput, Select, Button } from '@mantine/core'
import { useForm } from '@mantine/form'
import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { notifications } from '@mantine/notifications'
import { useAppContext } from '@/providers/appProvider'
import { DateInput } from '@mantine/dates'

const DISCOUNT_TYPES = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed', label: 'Fixed Amount' }
]

interface DiscountFormProps {
  data?: any
  updating?: boolean
}

const DiscountForm = ({ data, updating = false }: DiscountFormProps) => {
  const [loading, setLoading] = useState(false)
  const {token} = useAppContext()

  console.log("Data: ", data)
  
  const form = useForm({
    initialValues:  {
      code: updating ? data?.code : '',
      discount_type: updating ? data?.discount_type : '',
      value: updating ? data?.value : '',
      min_purchase: updating ? data?.min_purchase : '',
      max_discount: updating ? data?.max_discount : '',
      usage_limit: updating ? data?.usage_limit : '',
      start_date: updating ? new Date(data?.start_date) : new Date(),
      end_date: updating ? new Date(data?.end_date) : new Date(),
      description: updating ? data?.description : ''
    }
  })

  const handleSubmit = (values: any) => {
      setLoading(true)
      makeRequestOne({
        url: API_ENDPOINTS.ECOMMERCE_DISCOUNTS,
        method: 'POST',
        data: values,
        extra_headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(() => {
        notifications.show({
          title: 'Success',
          message: 'Discount created successfully',
          color: 'green'
        })
        form.reset()
      }).catch((err: any) => {
        console.error(err)
        notifications.show({
          title: 'Error',
          message: 'Failed to create discount',
          color: 'red'
        })
      }).finally(() => {
        setLoading(false)
      })
    }

    const radius = "md"

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Group grow>
          <TextInput
            label="Code"
            placeholder="Enter discount code"
            required
            {...form.getInputProps('code')}
            radius={radius}
          />
          <Select
            label="Discount Type"
            placeholder="Select discount type"
            required
            data={DISCOUNT_TYPES}
            {...form.getInputProps('discount_type')}
            radius={radius}
          />
        </Group>
        <Group grow>
          <TextInput
            label="Value"
            placeholder="Enter discount value"
            required
            type="number"
            {...form.getInputProps('value')}
            radius={radius}
          />
          <TextInput
            label="Min Purchase"
            placeholder="Enter minimum purchase amount"
            type="number"
            {...form.getInputProps('min_purchase')}
            radius={radius}
          />
        </Group>
        <Group grow>
          <TextInput
            label="Max Discount"
            placeholder="Enter maximum discount amount"
            type="number"
            {...form.getInputProps('max_discount')}
            radius={radius}
          />
          <TextInput
            label="Usage Limit"
            placeholder="Enter usage limit"
            type="number"
            {...form.getInputProps('usage_limit')}
            radius={radius}
          />
        </Group>
        <Group grow>
          <DateInput
            label="Start Date"
            placeholder="YYYY-MM-DD"
            {...form.getInputProps('start_date')}
            radius={radius}
          />
          <DateInput
            label="End Date"
            placeholder="YYYY-MM-DD"
            {...form.getInputProps('end_date')}
            radius={radius}
          />
        </Group>
        <TextInput
          label="Description"
          placeholder="Enter discount description"
          {...form.getInputProps('description')}
          radius={radius}
        />
        <Button
          type="submit"
          loading={loading}
          radius={radius}
        >
          {updating ? 'Update Discount' : 'Create Discount'}
        </Button>
      </Stack>
    </form>
  )
}

export default DiscountForm