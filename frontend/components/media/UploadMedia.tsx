import { showNotification } from '@mantine/notifications'
import React, { useState } from 'react'
import { makeRequestOne } from '../../config/config'
import { API_ENDPOINTS, EMOJIS } from '../../config/constants'
import { displayErrors } from '../../config/functions'
import { Grid, FileInput, Group, Loader, Button } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAppContext } from '../../providers/appProvider'
import { IconAlertCircle, IconAlertTriangle, IconFile3d, IconPlus } from '@tabler/icons-react'

interface IUploadMedia {
    mutate: any
}

const UploadMedia = (props: IUploadMedia) => {
    const { mutate } = props
    const { token } = useAppContext()

    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            media: [],
        },
        validate: {
            media: value => value.length === 0 ? 'Please select at least one file' : null,
        }
    })

    const handleUpload = (updating: boolean, id?: number, obj?: Object) => {
        setLoading(true)

        let data: any = {
            files: form.values.media
        }
        let method = 'POST'
        let url = API_ENDPOINTS.MEDIA
        let success_msg = "Your media files have been uploaded successfully"

        makeRequestOne({
            url, method, extra_headers: {
                'Content-Type': updating ? 'application/json' : 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }, data
        }).then((res: any) => {
            showNotification({
                title: `Congratulations ${EMOJIS['partypopper']} ${EMOJIS['partypopper']}`,
                message: success_msg,
                color: 'green',
                icon: <IconAlertCircle stroke={1.5} />,
            })
            mutate()
            form.reset()
        }).catch((error) => {
            const errors = error.response?.data
            if (typeof errors === 'object' && errors !== null && errors !== undefined) {
                displayErrors(form, errors)
            }
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

    return (
        <div>
            <form onSubmit={form.onSubmit((values) => handleUpload(false))}>
                <Grid>
                    <Grid.Col span={{ md: 9 }}>
                        <FileInput label="Select Files"
                            radius={"lg"}
                            multiple clearable
                            {...form.getInputProps('media')}
                            leftSection={loading ? <Loader /> : <IconFile3d />}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ md: 3 }}>
                        <Group className='h-100' align='end'>
                            <Button fullWidth radius={'md'} type="submit" leftSection={<IconPlus color='white' stroke={1.5} />}>
                                Upload
                            </Button>
                        </Group>
                    </Grid.Col>
                </Grid>
            </form>
        </div>
    )
}

export default UploadMedia