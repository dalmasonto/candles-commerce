import ContactCreateForm from '@/components/forms/more_forms/ContactCreateForm'
import SmallBtnBadge from '@/components/common/SmallBtnBadge'
import CustomDataTable from '@/components/tables/filters/CustomDataTable'
import { toDate } from '@/config/config'
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '@/config/constants'
import AdminWrapper from '@/layouts/AdminWrapper'
import requireAuthMiddleware from '@/middleware/requireAuthMiddleware'
import { Box, Button, Stack, Text, Title } from '@mantine/core'
import { modals } from '@mantine/modals'
import React from 'react'

const ContactFormEntries = () => {


    const readMsg = (item: any) => modals.open({
        title: item.subject,
        radius: 'md',
        size: 'lg',
        children: (
            <>
            <Stack gap={10}>
                <Title order={2}fw={500}>{item?.subject}</Title>
                <Text size='sm' c="dimmed">{item?.service}</Text>
                <Box>
                    {item?.message}
                </Box>
            </Stack>
            </>
        )
    })

    return (
        <div>
            <Stack>
                <Title>All Contact Form Entries</Title>
                <CustomDataTable
                    url={API_ENDPOINTS.CONTACT_FORM}
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
                        formNode: ContactCreateForm,
                        modalSize: 'lg',
                        updatingModalTitle: "Update Contact Form Entry",
                        deletingModalTitle: "Delete Contact Form Entry"
                    }}
                    columns={[
                        {
                            accessor: 'id',
                            title: 'ID',
                            width: '80px'
                        },
                        {
                            accessor: 'read',
                            title: 'Is Opened',
                            width: '180px',
                            render: (item: any) => (
                                item?.read ? <SmallBtnBadge color='green' label='Yes' /> : <SmallBtnBadge color='gray' label='No' />
                            )
                        },
                        {
                            accessor: "name",
                            title: "Name",
                            width: "300px",
                        },
                        {
                            accessor: "message",
                            title: "Message",
                            width: "300px",
                            render: (item: any) => (
                                <>
                                    <Button size='sm' radius={'xl'} w="100px" variant='light' onClick={() => readMsg(item)}>Read</Button>
                                </>
                            )
                        },
                        {
                            accessor: "email",
                            title: "Email",
                            width: "200px",
                            noWrap: false
                        },
                        {
                            accessor: "phone_no",
                            title: "Phone Number",
                            width: "200px",
                            noWrap: false
                        },
                        {
                            accessor: "subject",
                            title: "Subject",
                            width: "200px",
                            noWrap: false
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
                            placeholder: 'Search by name, subject, message, service',
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
                                        { value: 'name', label: 'Name' },
                                    ]
                                },
                                {
                                    group: 'Descending',
                                    items: [
                                        { value: '-id', label: 'ID' },
                                        { value: '-name', label: 'Name' },
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

ContactFormEntries.PageLayout = AdminWrapper

export default ContactFormEntries
