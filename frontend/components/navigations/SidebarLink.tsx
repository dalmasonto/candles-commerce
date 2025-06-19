import { NavLink, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import Link from 'next/link'
import { useRouter } from 'next/router';
import React from 'react'
import { matchTest } from '../../config/config';

export interface SidebarLinkProps {
    label: string,
    href: string,
    icon?: React.ReactNode,
    children?: SidebarLinkProps[] | null,
    click?: any
}

export interface SidebarLinkGroupProps {
    id: string,
    label: string, 
    icon?: React.ReactNode,
    links: SidebarLinkProps[]
}

const SidebarLink = ({ label, href, icon, children, click }: SidebarLinkProps) => {
    const theme = useMantineTheme()
    const router = useRouter()
    const {colorScheme} = useMantineColorScheme()

    const match = () => {
        const path = router.asPath
        return matchTest(path, href)
    }

    return (
        <>
            {
                children && children.length > 0 ? (
                    <NavLink label={label} leftSection={icon} active={match()} style={{
                        borderRadius: theme.radius.md,
                    }}>
                        {
                            children?.map((child: SidebarLinkProps, i: number) => (
                                <SidebarLink key={`sidebar_child_${label}_${i}`} {...child} />
                            ))
                        }
                    </NavLink>
                ) :
                    null
            }

            {
                !children ? (
                    <NavLink component={Link} label={label} variant='filled' href={href} leftSection={icon} fw={500} active={match()} style={{
                        borderRadius: theme.radius.md,
                        // background: match() ? theme.colors.gre isDarkMode(colorScheme)
                    }} onClick={click} />
                ) : null
            }


        </>
    )
}

export default SidebarLink