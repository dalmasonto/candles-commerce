import { Box, Button, Center, CopyButton, Drawer, Group, Image, Stack, TextInput, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import React, { useState } from 'react'
import { useForm } from '@mantine/form'
import { IconWriting, IconCheck, IconCopy, IconTrash } from '@tabler/icons-react'

interface FileBoxProps {
    item: any,
    padding?: string,
    radius?: string,
    handleDelete: any,
    handleUpdate: any,
}

const FileBox = (props: FileBoxProps) => {
    const { item, padding, radius, handleDelete, handleUpdate } = props
    const { colorScheme } = useMantineColorScheme()

    const theme = useMantineTheme()
    const [opened, setOpened] = useState(false)
    const form = useForm({
        initialValues: {
            title: item?.title,
            description: item?.description,
        },
        validate: {
            title: value => value.length > 5 ? null : "Title must be at least 5 characters long",
        }

    })

    function renderItem() {
        return (
            <>
                {
                    item?.type === 'image' ? (
                        <Image loading='lazy' radius={radius ? radius : "sm"} src={item?.file}/>
                    ) : null
                }
                {
                    item?.type === 'document' ? (
                        <>Doc</>
                    ) : null
                }
                {
                    item?.type === 'video' ? (
                        <>Vid</>
                    ) : null
                }
                {
                    item?.type === 'audio' ? (
                        <>Audio</>
                    ) : null
                }
                {
                    item?.type === 'unknown' ? (
                        <>Other</>
                    ) : null
                }
            </>
        )
    }

    return (
        <>
            <Box p={padding ? padding : "xs"} mah={'100px'} style={{
                overflow: "hidden",
                borderRadius: theme.radius[radius ? radius : "md"],
                cursor: "pointer",
            }} onClick={() => setOpened(current => !current)} >
                <Center className=" w-100">
                    {renderItem()}
                </Center>
            </Box>
            <Drawer title={item?.title} zIndex={202} opened={opened} onClose={() => setOpened(current => !current)} >

                <Stack>
                    {renderItem()}
                    <form onSubmit={form.onSubmit((values) => handleUpdate(item?.id, values))}>
                        <Stack>
                            <TextInput label="File Title/Alt" radius="sm" {...form.getInputProps('title')} />
                            <Group justify='right'>
                                <Button leftSection={<IconWriting color='white' stroke={1.5} />} type="submit" >Update</Button>
                            </Group>
                        </Stack>
                    </form>
                    <Group justify="center">
                        <CopyButton value={item?.file}>
                            {({ copied, copy }) => (
                                <Button radius={"md"} color={copied ? "green" : "blue"} onClick={copy} leftSection={copied ? <IconCheck /> : <IconCopy />}>
                                    {copied ? 'Copied' : 'Copy File URL'}
                                </Button>
                            )}
                        </CopyButton>
                        <CopyButton value={item?.title}>
                            {({ copied, copy }) => (
                                <Button radius={"md"} color={copied ? "green" : "blue"} onClick={copy} leftSection={copied ? <IconCheck /> : <IconCopy />}>
                                    {copied ? 'Copied' : 'Copy File Title'}
                                </Button>
                            )}
                        </CopyButton>
                        <Button radius={"md"} color={"red"} onClick={() => handleDelete(item?.id)} leftSection={<IconTrash />}>
                            Delete
                        </Button>
                    </Group>
                </Stack>
            </Drawer>
        </>
    )
}

export default FileBox