import { PRIMARY_DEEP_COLOR } from '@/config/constants'
import { Box, darken, Text, useMantineTheme } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import classes from '@/styles/footer.module.css'

interface IFooterLink {
    title: string
    href: string
}
const FooterLink = (props: IFooterLink) => {
    const { title, href } = props
    return (
        <Text component={Link} href={href} className={classes.footer_link}>{title}</Text>
    )
}

const CustomFooter = () => {
    const theme = useMantineTheme()

    return (
        <Box style={{
            background: darken(theme.colors[theme.primaryColor][9], 0.6),
        }} pt={80} pos={'relative'}>

        </Box>
    )
}

export default CustomFooter