import CreateUserForm from '@/components/forms/CreateUserForm'
import CustomDataTable from '@/components/tables/filters/CustomDataTable'
import { toDate } from '@/config/config'
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '@/config/constants'
import AdminWrapper from '@/layouts/AdminWrapper'
import requireAuthMiddleware from '@/middleware/requireAuthMiddleware'
import { Avatar, Group, Stack, Text, Title } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import React from 'react'

const AllUsers = () => {
    return (
        <div>
            <Stack>
                <Title>All Users</Title>
                <CustomDataTable
                    url={API_ENDPOINTS.USERS}
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
                        formNode: CreateUserForm,
                        modalSize: 'lg',
                        updatingModalTitle: "Update User",
                        deletingModalTitle: "Delete User",
                        extraFormProps: {
                            is_admin: true
                        }
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
                            width: "300px",
                            render: (item: any) => (
                                <Group p={0} style={{
                                    cursor: "pointer"
                                }} wrap='nowrap'>
                                    <Avatar radius="md" src={item?.profile?.avatar} alt={item?.name} />
                                    <Stack gap={2}>
                                        <Text size="sm">{item?.full_name}</Text>
                                        <Text size="xs" c={'dimmed'}>{item?.email}</Text>
                                        <Text size="sm">{item?.username}</Text>
                                    </Stack>
                                </Group>
                            )
                        },
                        {
                            accessor: 'profile.phone_number',
                            title: 'Phone Number',
                            width: '180px',
                        },
                        {
                            accessor: 'is_superuser',
                            title: 'Is admin',
                            width: '180px',
                            render: (item: any) => (
                                item?.is_superuser ? <IconCheck color='green' /> : <IconX color='red' />
                            )
                        },
                        {
                            accessor: 'is_active',
                            title: 'Is Active',
                            width: '180px',
                            render: (item: any) => (
                                item?.is_active ? <IconCheck color='green' /> : <IconX color='red' />
                            )
                        },
                        {
                            accessor: 'gender',
                            title: 'Gender',
                            width: '180px',
                            render: (item: any) => (
                                <Text tt={'capitalize'}>{item?.profile?.gender ?? '-'}</Text>
                            )
                        },
                        // {
                        //     accessor: "profile.county.name",
                        //     title: "County",
                        //     width: "150px",
                        //     render: (item: any) => (
                        //         <Text>{item?.profile?.county?.name ?? '-'}</Text>
                        //     )
                        // },
                        {
                            accessor: 'date_joined',
                            title: 'Registered On',
                            width: '250px',
                            render: (item: any) => (
                                <Text size='sm'>{toDate(item?.date_joined, true)}</Text>
                            )
                        },
                        {
                            accessor: 'last_login',
                            title: 'Last Login',
                            width: '250px',
                            render: (item: any) => (
                                <Text size='sm'>{toDate(item?.last_login, true)}</Text>
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
                            placeholder: 'Search by name, email, username, phone number',
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
                                        { value: 'first_name', label: 'First NameName' },
                                    ]
                                },
                                {
                                    group: 'Descending',
                                    items: [
                                        { value: '-id', label: 'ID' },
                                        { value: '-first_name', label: 'First Name' },
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

AllUsers.PageLayout = AdminWrapper

export default AllUsers
