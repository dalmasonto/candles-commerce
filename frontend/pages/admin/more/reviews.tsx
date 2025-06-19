import CreateReviewForm from '@/components/forms/more_forms/CreateReviewForm'
import SmallBtnBadge from '@/components/common/SmallBtnBadge'
import CustomDataTable from '@/components/tables/filters/CustomDataTable'
import { toDate } from '@/config/config'
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '@/config/constants'
import AdminWrapper from '@/layouts/AdminWrapper'
import requireAuthMiddleware from '@/middleware/requireAuthMiddleware'
import { Box, Button, Rating, Stack, Text, Title } from '@mantine/core'
import { modals } from '@mantine/modals'
import React from 'react'

const ContactFormEntries = () => {


    const readMsg = (item: any) => modals.open({
        title: `${item?.user?.full_name}'s Review`,
        radius: 'md',
        size: 'lg',
        children: (
            <>
            <Stack gap={10}>
                <Box>
                    {item?.review}
                </Box>
            </Stack>
            </>
        )
    })

    return (
        <div>
            <Stack>
                <Title>Reviews</Title>
                <CustomDataTable
                    url={API_ENDPOINTS.REVIEWS}
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
                        formNode: CreateReviewForm,
                        modalSize: 'lg',
                        updatingModalTitle: "Update Review",
                        deletingModalTitle: "Delete Review"
                    }}
                    columns={[
                        {
                            accessor: 'id',
                            title: 'ID',
                            width: '80px'
                        },
                        {
                            accessor: "rating",
                            title: "Ratings",
                            width: "200px",
                            noWrap: false,
                            render: (item: any) => (
                                <Rating color='orange' fractions={2} value={item?.rating} />
                            )
                        },
                        {
                            accessor: "user_name",
                            title: "Reviewer",
                            width: "300px",
                        },
                        {
                            accessor: 'is_public',
                            title: 'Is Public',
                            width: '180px',
                            render: (item: any) => (
                                item?.is_public ? <SmallBtnBadge color='green' label='Yes' /> : <SmallBtnBadge color='gray' label='No' />
                            )
                        },
                        {
                            accessor: "review",
                            title: "Review",
                            width: "300px",
                            render: (item: any) => (
                                <>
                                    <Button size='sm' radius={'xl'} w="100px" variant='light' onClick={() => readMsg(item)}>Read</Button>
                                </>
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
                            placeholder: 'Search by review',
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
