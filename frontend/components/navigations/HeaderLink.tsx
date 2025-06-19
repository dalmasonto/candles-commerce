import { Anchor, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import Link from 'next/link'
import { useRouter } from 'next/router';
import React from 'react'
import { isDarkMode, matchTest } from '../../config/config';
import { LINK_WEIGHT } from '../../config/constants';

interface HeaderLinkProps {
    label: string,
    href: string,
    icon?: React.ReactNode,
}

const HeaderLink = ({ label, href, icon }: HeaderLinkProps) => {
    const theme = useMantineTheme()
    const router = useRouter()
    const { colorScheme } = useMantineColorScheme()


    const match = () => {
        const path = router.asPath
        return matchTest(path, href)
    }
    return (
        <Anchor href={href} component={Link} mr="xl"
            c={match() ? theme.colors[theme.primaryColor][8] : isDarkMode(colorScheme) ? theme.white ?? 'contrast' : theme.colors.dark[6]}
            size="md" fw={LINK_WEIGHT}>
            {label}
        </Anchor>
    )
}

export default HeaderLink