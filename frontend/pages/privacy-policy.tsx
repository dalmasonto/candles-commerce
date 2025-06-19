import HeaderAndFooterWrapper from '@/layouts/HeaderAndFooterWrapper'
import { Box, Stack, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import React from 'react'

const PrivacyPolicy = () => {
    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()

    return (
        <div>
            <Box className='book-bg'>
                <Stack>
                    
                </Stack>
            </Box>
        </div >
    )
}
PrivacyPolicy.PageLayout = HeaderAndFooterWrapper
export default PrivacyPolicy