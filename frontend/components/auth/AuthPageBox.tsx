import { isDarkMode } from '@/config/config'
import { LOGO_URL } from '@/config/constants'
import { Box, Center, Container, Image, Paper, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import React, { ReactNode } from 'react'

interface IAuthPageBox {
    children: ReactNode
}

const AuthPageBox = ({ children }: IAuthPageBox) => {
    const { colorScheme } = useMantineColorScheme()
    const theme = useMantineTheme()
    const matches = useMediaQuery('(max-width: 992px)');

    return (
        <Box h={'1000px'} style={{
            background: isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[0],
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundBlendMode: 'multiply',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
        }}>
            <Center className='h-100'>
                <Box className='w-100' py="md" size="lg">
                    <Container size={"sm"}>
                        <Paper
                            className="h-100"
                            style={{ overflow: "hidden" }}
                            radius="lg" p={matches ? 20 : 40}
                        >
                            <Center>
                                <Image src={LOGO_URL} mah={'200px'} />
                            </Center>
                            {children}
                        </Paper>
                    </Container>
                </Box>
            </Center>
        </Box>
    )
}

export default AuthPageBox