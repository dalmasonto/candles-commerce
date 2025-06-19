import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { makeRequestOne } from '../../config/config'
import { API_ENDPOINTS, EMOJIS } from '../../config/constants'
import { Stack, Grid, Box, Pagination, LoadingOverlay, Tabs, Title, SegmentedControl, Select } from '@mantine/core'
import FileBox from './FileBox'
import UploadMedia from './UploadMedia'
import { IconAlertCircle, IconAlertTriangle } from '@tabler/icons-react'

interface IFilesComponent {
    files: any
    handleDelete: any
    handleUpdate: any
}

const FilesComponent = ({ files, handleDelete, handleUpdate }: IFilesComponent) => {

    return (
        <>
            {
                files?.length === 0 ? (
                    <Box>
                        <Title order={3} fw={500} ta='start'>No Media Found</Title>
                    </Box>
                ) : null
            }
            <Grid>
                {
                    files?.map((item: any, i: any) => (
                        <Grid.Col key={`image_${i}_${item?.id}`} span={{ md: 2 }} style={{ position: "relative" }}>
                            <FileBox item={item} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                        </Grid.Col>
                    ))
                }
            </Grid>
        </>
    )
}

const initialFilterState = {
    search: "",
    ordering: "id",
    type: "all",
    page: 1,
    limit: '10',
}

interface ImagesProps {
    padding?: string,
    radius?: string,
}

const Images = (props: ImagesProps) => {

    const [loading, setLoading] = useState(false)

    const filterForm = useForm({
        initialValues: initialFilterState
    })
    const myFilters = filterForm.values
    const { data, error, isValidating, mutate, isLoading } = useSWR({ url: `${API_ENDPOINTS.MEDIA}`, method: "GET", extra_headers: {}, data: {}, params: { ...myFilters, type: myFilters?.type === 'all' ? '' : myFilters.type } }, makeRequestOne)

    const files = data?.data?.results
    const count = data?.data?.count
    const pages = data?.data?.total_pages


    const handleDelete = (id: number) => {
        makeRequestOne({ url: API_ENDPOINTS.MEDIA + "/" + id, method: 'DELETE', useNext: false }).then((res: any) => {
            mutate()
            showNotification({
                title: `Deleted ${EMOJIS['partypopper']} ${EMOJIS['partypopper']}`,
                message: "Your image has been deleted successfully",
                color: 'green',
                icon: <IconAlertCircle stroke={1.5} />,
            })
        }).catch((error) => {
            showNotification({
                title: 'Error',
                message: error?.response?.message,
                color: 'red',
                icon: <IconAlertTriangle stroke={1.5} />,
            })
        })
    }

    const handleUpdate = (id: any, obj: any) => {
        const data = obj
        const method = 'PUT'
        const url = API_ENDPOINTS.MEDIA + "/" + id
        const success_msg = `Your media file has been updated successfully ${EMOJIS['partypopper']} ${EMOJIS['partypopper']}`

        makeRequestOne({
            url, method, extra_headers: {
                'Content-Type': 'application/json',
            }, data
        }).then((res: any) => {
            showNotification({
                title: `Congratulations ${EMOJIS['partypopper']} ${EMOJIS['partypopper']}`,
                message: success_msg,
                color: 'green',
                icon: <IconAlertCircle stroke={1.5} />,
            })
            mutate()
        }).catch((error) => {
            const errors = error.response?.data
            showNotification({
                title: 'Error',
                message: error?.message,
                color: 'red',
                icon: <IconAlertTriangle stroke={1.5} />,
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        filterForm.setFieldValue('page', 1)
    }, [filterForm.values.type, filterForm.values.limit])

    return (
        <>
            <Stack>
                <Box>
                    <Stack>
                        <Title>All Media Assets</Title>
                        <Grid>
                            <Grid.Col span={{ md: 12 }}>
                                <UploadMedia mutate={mutate} />
                            </Grid.Col>
                        </Grid>
                        <Grid>
                            <Grid.Col span={{ md: 2 }}>
                                <Select size='sm' radius="lg" {...filterForm.getInputProps('limit')}
                                    data={[
                                        { value: '5', label: '5' },
                                        { value: '10', label: '10' },
                                        { value: '20', label: '20' },
                                        { value: '30', label: '30' },
                                        { value: '40', label: '40' },
                                    ]} />
                            </Grid.Col>
                            <Grid.Col span={{ md: 10 }}>
                                <SegmentedControl size='sm' radius="lg" className='w-100' {...filterForm.getInputProps('type')}
                                    data={[
                                        {
                                            label: "All",
                                            value: "all",
                                        },
                                        {
                                            label: "Photos",
                                            value: "image",
                                        },
                                        {
                                            label: "PDFs/Documents",
                                            value: "document",
                                        },
                                        {
                                            label: "Videos",
                                            value: "video",
                                        },
                                        {
                                            label: "Audio",
                                            value: "audio",
                                        },
                                        {
                                            label: "UnClassified",
                                            value: "unknown",
                                        },
                                    ]}
                                />
                            </Grid.Col>
                        </Grid>
                        <Box style={{ position: "relative" }}>
                            <LoadingOverlay visible={isLoading} overlayProps={{ blur: 10 }} />
                            <Tabs value={filterForm.values.type} mih={200}>
                                <Tabs.Panel value="all" pt="xs">
                                    <FilesComponent files={files} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                                </Tabs.Panel>
                                <Tabs.Panel value="image" pt="xs">
                                    <FilesComponent files={files} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                                </Tabs.Panel>

                                <Tabs.Panel value="document" pt="xs">
                                    <FilesComponent files={files} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                                </Tabs.Panel>

                                <Tabs.Panel value="video" pt="xs">
                                    <FilesComponent files={files} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                                </Tabs.Panel>
                                <Tabs.Panel value="audio" pt="xs">
                                    <FilesComponent files={files} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                                </Tabs.Panel>
                                <Tabs.Panel value="unknown" pt="xs">
                                    <FilesComponent files={files} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                                </Tabs.Panel>
                            </Tabs>
                        </Box>
                        <Box pt={"lg"}>
                            <Pagination radius={'md'} {...filterForm.getInputProps('page')} total={pages} />
                        </Box>
                    </Stack>
                </Box>
            </Stack >
        </>
    )
}

export default Images