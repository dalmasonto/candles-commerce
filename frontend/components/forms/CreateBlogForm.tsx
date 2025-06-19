import { isDarkMode, makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { displayErrors } from '@/config/functions'
import { Box, Button, Grid, Group, Loader, Stack, Switch, TextInput, Textarea, Title, useMantineColorScheme } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconAlertCircle, IconAlertTriangle, IconArticleFilled } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '@/providers/appProvider'
import CustomRTE from './CustomRTE'
import { useDebouncedState } from '@mantine/hooks'
import SelectCategoriesInput from '../common/SelectCategoriesInput'

const CustomCol = (props: any) => {
    const { children, ...rest } = props
    return (
        <Grid.Col {...rest}>
            {children}
        </Grid.Col>
    )
}

interface ICreateBlogForm {
    updating?: boolean
    data?: any
    mutate?: any
}


interface IForm {
    [key: string]: any
}

const CreateBlogForm = (props: ICreateBlogForm) => {
    const { updating, data, mutate } = props
    const { colorScheme } = useMantineColorScheme()

    const [articleContent, setArticleContent] = useDebouncedState(updating ? data?.content : "<h3>Write article here</h3>", 2000)
    const [loading, setLoading] = useState(false)
    const { token, user_id } = useAppContext()

    const form = useForm<IForm>({
        initialValues: {
            author: updating ? data?.author.id : '',
            title: updating ? data?.title : '',
            description: updating ? data?.description : '',
            keywords: updating ? data?.keywords : '',
            categories: updating ? data?.categories?.map((cat: any) => cat?.id?.toString()) ?? [] : '',
            content: updating ? data?.content : '',
            image: updating ? data?.image : '',
            image_alt_text: updating ? data?.image_alt_text : '',
            is_newsletter: updating ? data?.is_newsletter : false
        },

        validate: {
            title: val => val === '' ? 'Article Title is required' : null,
            description: val => val === '' ? 'Article Description is required' : null,
            keywords: val => val === '' ? 'Article Keywords are required' : null,
            categories: val => val === '' ? 'Select a category for the article' : null,
            image: val => val === '' ? 'Article Title is required' : null,
            image_alt_text: val => val === '' ? 'Article Title is required' : null,
        },
    });

    const handleSubmit = () => {
        setLoading(true)
        const data_ = JSON.parse(JSON.stringify(form.values))

        let METHOD = "POST"
        let URL = API_ENDPOINTS.BLOGS
        const extra_headers: any = {}

        if (updating) {
            METHOD = "PUT"
            URL = `${URL}/${data?.id}`
            data_.id = data.id
            delete data_.user?.password
            delete data_.user?.password_repeat
            // delete data_.user?.username
            delete data_.user?.email
            extra_headers['Authorization'] = `Bearer ${token}`
        } else {
            data_.author = user_id
        }

        makeRequestOne({ url: `${URL}`, method: METHOD, data: { ...data_ }, useNext: false, extra_headers }).then((res: any) => {
            showNotification({
                title: "Blog",
                message: updating ? "Blog updated successfully" : "Blog creation successful",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            if (!updating) {
                form.reset()
            }
            mutate && mutate()
        }).catch(error => {
            showNotification({
                title: "Blog",
                message: `${error?.message}`,
                color: "red",
                icon: <IconAlertTriangle stroke={1.5} />
            })
            const error_data = error?.response?.data
            if (typeof (error_data) === 'object') {
                displayErrors(form, error_data)
            }
        }).finally(() => {
            setLoading(false)
        })
    }


    const updateFormArticleContent = (new_val: any) => {
        setArticleContent(new_val)
    }

    useEffect(() => {
        form.setFieldValue('content', articleContent)
    }, [articleContent])


    return (
        <Box px="lg" style={theme => ({
            background: isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[0],
            borderRadius: theme.radius.lg
        })}>
            <form onSubmit={form.onSubmit((_values: any) => { handleSubmit() })}>
                <Stack gap={20} py="xl">
                    <Title order={2} fw={500} ta={'center'}>Create an Article/Newsletter</Title>
                    <Grid>
                        <CustomCol span={{ md: 12 }}>
                            <TextInput label="Title" size='sm' radius={'md'} {...form.getInputProps('title')} placeholder='Article Title' />
                        </CustomCol>
                        <CustomCol span={{ md: 12 }}>
                            <Textarea label="Description" rows={4} size='sm' radius={'md'} {...form.getInputProps('description')} placeholder='Give some short description here' />
                        </CustomCol>
                        <CustomCol span={{ md: 12 }}>
                            <CustomRTE content={form.values.content} updateForm={updateFormArticleContent} readonly={false} />
                        </CustomCol>
                        <CustomCol span={{ md: 12 }}>
                            <SelectCategoriesInput form={form} field_name='categories' size='sm' multiple={false} />
                        </CustomCol>
                        <CustomCol span={{ md: 12 }}>
                            <Textarea label="Keywords" description="Comma separated keywords for SEO" rows={2} size='sm' radius={'md'} {...form.getInputProps('keywords')} placeholder='keyword 1, keyword 2' />
                        </CustomCol>
                        <CustomCol span={{ md: 12 }}>
                            <TextInput label="Image" description="Use the Media tab to upload and get image URLs" size='sm' radius={'md'} {...form.getInputProps('image')} placeholder='Enter URL for Main Image' />
                        </CustomCol>
                        <CustomCol span={{ md: 12 }}>
                            <TextInput label="Image Alt Text" description="Give brief information that describes the image above" size='sm' radius={'md'} {...form.getInputProps('image_alt_text')} placeholder='Rhea Pitching at AgriTech summit' />
                        </CustomCol>
                        <CustomCol span={{ md: 12 }}>
                            <Switch label="Is this a Newsletter?" {...form.getInputProps('is_newsletter', { type: 'checkbox' })} />
                        </CustomCol>
                    </Grid>
                    <Group justify="center" style={{ textAlign: "center" }}>
                        <Button radius={'md'} rightSection={loading ? <Loader color='white' size={16} /> : <IconArticleFilled size={16} />} type='submit' >
                            {
                                updating ? "Update Blog" : "Create Blog"
                            }
                        </Button>
                    </Group>
                </Stack>

            </form>
        </Box>
    )
}

export default CreateBlogForm