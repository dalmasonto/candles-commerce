import CreateBlogCategoryForm from '@/components/forms/more_forms/CreateBlogCategoryForm'
import CustomDataTable from '@/components/tables/filters/CustomDataTable'
import { toDate } from '@/config/config'
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '@/config/constants'
import AdminWrapper from '@/layouts/AdminWrapper'
import requireAuthMiddleware from '@/middleware/requireAuthMiddleware'
import { Stack, Text, Title } from '@mantine/core'
import React from 'react'

const BlogCategories = () => {
    
    return (
        <div>
            <Stack>
                <Title>Categories</Title>
                <CustomDataTable
                    url={API_ENDPOINTS.CATEGORIES}
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
                        formNode: CreateBlogCategoryForm,
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
                            accessor: "title",
                            title: "Title",
                            width: "200px",
                        },
                        {
                            accessor: "slug",
                            title: "Slug",
                            width: "200px",
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
                            placeholder: 'Search by title',
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
                                        { value: 'title', label: 'Title' },
                                    ]
                                },
                                {
                                    group: 'Descending',
                                    items: [
                                        { value: '-id', label: 'ID' },
                                        { value: '-title', label: 'Title' },
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
    const cookies = context.req.cookies
    const userDetails_: any = cookies[LOCAL_STORAGE_KEYS.user]

    const token = cookies[LOCAL_STORAGE_KEYS.token]

    const userDetails: any = JSON.parse(userDetails_ ?? "{}")

    return {
        props: {

        }
    }
}

BlogCategories.PageLayout = AdminWrapper

export default BlogCategories
