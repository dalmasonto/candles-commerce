import { makeRequestOne, toDate } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import AdminWrapper from '@/layouts/AdminWrapper'
import requireAuthMiddleware from '@/middleware/requireAuthMiddleware'
import { useAppContext } from '@/providers/appProvider'
import { ActionIcon, Button, Group, Image, Paper, Stack, Table, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { notifications } from '@mantine/notifications'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import CreateEcommerceCategoryForm from '@/components/forms/CreateEcommerceCategoryForm'
import CustomDataTable from '@/components/tables/filters/CustomDataTable'


const CategoriesPage = () => {
  const router = useRouter()





  return (
    <div>
      <Stack>
        <Title>Categories</Title>
        <CustomDataTable
          url={API_ENDPOINTS.ECOMMERCE_CATEGORIES}
          method={'GET'}
          height={"400px"}
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
            formNode: CreateEcommerceCategoryForm,
            modalSize: 'lg',
            updatingModalTitle: "Update Category",
            deletingModalTitle: "Delete Category"
          }}
          columns={[
            {
              accessor: 'id',
              title: 'ID',
              width: '80px'
            },
            {
              accessor: "name",
              title: "Name",
              width: "200px",
              render: (item: any) => (
                <Group>
                  <Image src={item?.image} w={"40px"} mah={"100px"} />
                  <Text size='sm'>{item?.name}</Text>
                </Group>
              )
            },
            {
              accessor: "slug",
              title: "Slug",
              width: "200px",
            },
            {
              accessor: "description",
              title: "Description",
              width: "200px",
            },
            {
              accessor: "parent",
              title: "Parent",
              width: "200px",
            },
            {
              accessor: "is_active",
              title: "Is Active",
              width: "200px",
              render: (item: any) => (
                <Text size='sm'>{item?.is_active ? 'Yes' : 'No'}</Text>
              )
            },
            {
              accessor: 'created_on',
              title: 'Created On',
              width: '250px',
              render: (item: any) => (
                <Text size='sm'>{toDate(item?.created_on, true)}</Text>
              )
            },
            {
              accessor: 'updated_on',
              title: 'Modified On',
              width: '250px',
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

CategoriesPage.PageLayout = AdminWrapper

export default CategoriesPage 