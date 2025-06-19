import { Card, Stack, Avatar, Text, Skeleton, useMantineColorScheme } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../providers/appProvider'
import { isDarkMode, limitChars } from '@/config/config'
import { loadMediaURL } from '@/config/functions'


const UserLoader = ({ userD }: { userD: any }) => {
    if (userD) {
        return (
                <Stack justify='center' align='center' gap={4}>
                    <Text size="sm" mb={4} >
                        {`${userD?.full_name}`}
                    </Text>
                    <Text size="xs" mb={4} >
                        {userD?.username}
                    </Text>
                    <Text size="sm" mb={4}>
                        {userD?.email}
                    </Text>
                </Stack>
        )
    }
    else {
        return (
                <Stack justify='center' align='center' gap={4}>
                    <Skeleton radius="md" my={4} width={180} height={16} animate />
                    <Skeleton radius="md" mb={4} width={150} height={12} animate />
                    <Skeleton radius="md" mb={4} width={200} height={16} animate />
                </Stack>
        )
    }
}


const UserCard = () => {

    const [userD, setUser] = useState<null | any>(null)
    const { user } = useAppContext()
    const { colorScheme } = useMantineColorScheme()

    useEffect(() => {
        setUser(user)
    }, [])

    return (
        <Card radius="lg" style={theme => ({
            background: isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.orange[8],
            color: theme.colors.gray[2]
        })}>
            <Stack gap={4} justify='center' align='center'>
                <Avatar bg={'rgba(0,0,0,0.1)'} src={loadMediaURL(userD?.profile?.avatar)} c={'white'} style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    color: "white"
                }} tt={'uppercase'}>
                    {limitChars(userD?.username, 2, false)}
                </Avatar>
                <UserLoader userD={userD} />
            </Stack>
        </Card>
    )
}

export default UserCard