import { AppShell, Burger, useMantineTheme, Group, NavLink, Anchor, Drawer, Stack, Box, useMantineColorScheme, Container, Image } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import HeaderLink from '../components/navigations/HeaderLink'
import { BLUE_BG_COLOR, LOGO_URL, PRIMARY_SHADE } from '../config/constants'
import Link from 'next/link'
import { showNotification } from '@mantine/notifications'
import { useAppContext } from '../providers/appProvider'
import AccountBtn from '../components/account/AccountBtn'
import ColorSchemeToggle from '@/components/ColorSchemeToggle/ColorSchemeToggle'
import { IconHome2, IconLogin, IconAlertCircle, IconLogout, IconUserCircle, IconInfoCircle, IconBriefcase, IconPhone, IconRegistered } from '@tabler/icons-react'
import { isDarkMode, matchTest } from '@/config/config'
import { useRouter } from 'next/router'
import CustomFooter from '@/components/common/CustomFooter'


interface CustomDrawerLinkProps {
    href: string,
    icon?: React.ReactElement | null,
    label: string,
    children?: CustomDrawerLinkProps[] | null,
    loginRequired?: boolean,
    click?: any
}

const CustomDrawerLink = (props: CustomDrawerLinkProps) => {
    const { label, href, icon, children, loginRequired, click } = props
    const { colorScheme } = useMantineColorScheme()
    const theme = useMantineTheme()

    const router = useRouter()

    const match = () => {
        const path = router.asPath
        return matchTest(path, href)
    }

    return (
        <>
            {
                children && children.length > 0 ? (
                    <NavLink label={label} leftSection={icon}>
                        {
                            children?.map((child: CustomDrawerLinkProps, i: number) => (
                                <CustomDrawerLink key={`drawer_child_${label}_${i}`} {...child} />
                            ))
                        }
                    </NavLink>
                ) : (
                    <Anchor component={Link} href={href} fw={500} passHref c={match() ? PRIMARY_SHADE[2] : isDarkMode(colorScheme) ? theme.colors.gray[0] : theme.colors.dark[6]}>
                        <NavLink leftSection={icon} label={label} onClick={click} />
                    </Anchor>
                )
            }
        </>
    )
}

const navlinks: CustomDrawerLinkProps[] = [
    // { label: 'Home', href: '/', icon: <IconHome2 /> },
    // { label: 'About', href: '/#about', icon: <IconInfoCircle /> },
    // { label: 'Services', href: '/#services', icon: <IconBriefcase /> },
    // { label: 'Contact Us', href: '/contact-us', icon: <IconPhone /> },
]



const accountLinks: CustomDrawerLinkProps[] = [
    {
        label: "Login",
        href: "/auth/login",
        icon: <IconLogin />,
        loginRequired: false
    },
]

export const LogoutLink = () => {

    const handleLogout = () => {
        showNotification({
            title: "Account logout",
            message: "You have logged out successfully",
            color: "blue",
            icon: <IconAlertCircle />
        })
    }

    return (
        <NavLink leftSection={<IconLogout />} label={'Logout'}
            onClick={handleLogout} />
    )
}

interface NavbarAndFooterWrapperProps {
    children: React.ReactNode
}

const HeaderAndFooterWrapper = ({ children }: NavbarAndFooterWrapperProps) => {

    const [opened, setOpened] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false)
    const closeDrawer = () => setOpened((o) => !o)
    const { colorScheme } = useMantineColorScheme()


    const { login_status } = useAppContext()

    const theme = useMantineTheme();
    const matches = useMediaQuery('(max-width: 992px)');

    useEffect(() => {

        if (login_status !== null) {
            setLoggedIn(login_status)
        }
        else {
            setLoggedIn(false)
        }
    }, [login_status])

    return (
        <AppShell
            styles={(theme) => ({
                main: {
                    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : BLUE_BG_COLOR,
                    overflow: "hidden",
                    transition: "color background-color 1s cubic-bezier(0.42, 0, 1, 1)",
                },
            })}
            navbar={{
                breakpoint: 'xs',
                width: { sm: 200, lg: 300 },
                collapsed: { desktop: true, mobile: !opened }
            }}
            padding={0}
            header={{
                height: { base: 60, md: 70 }
            }}
        >
            <AppShell.Header w={"100vw"} withBorder={true} style={{
                background: isDarkMode(colorScheme) ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
            }} >
                <Container size={'xxl'} className='h-100'>
                    <Group justify='space-between' className='h-100' align='center'>
                        <Group className='h-100' align='center' justify='center'>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                hiddenFrom='xl'
                            />
                            <Link href={'/'}>
                                <Image src={LOGO_URL} w={"60px"} />
                            </Link>
                            {/* <Title order={2} fw={500}>{APP_NAME}</Title> */}
                        </Group>
                        {matches ? null : (
                            <Group align='center'>
                                {navlinks.map((link: any, i: number) => (
                                    <HeaderLink key={`header_link_${i}`} {...link} />
                                ))}
                            </Group>
                        )}
                        <Group gap={4}>
                            <AccountBtn />
                            <ColorSchemeToggle />
                        </Group>
                    </Group>
                </Container>
            </AppShell.Header>
            <AppShell.Main style={{ zIndex: 2 }}>
                <div style={{ minHeight: "calc(100vh - 70px)" }}>
                    {children}
                </div>
            </AppShell.Main>
            {/* <AppShell.Footer pos={'static'} withBorder={false}>
                <CustomFooter />
            </AppShell.Footer> */}
            <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                title="Menu"
                padding="xl"
                size="md"
                position='bottom'
                radius={'30px'}
                styles={{
                    content: {
                        borderTopLeftRadius: "30px !important",
                        borderTopRightRadius: "30px !important",
                    },
                    header: {
                        boxShadow: theme.shadows.xs,
                    }

                }}
                overlayProps={{
                    opacity: .3,
                    blur: 5,
                }}
                withOverlay
                shadow='lg'
            >
                <Stack gap={0}>
                    {navlinks.map((linkInfo: CustomDrawerLinkProps, i: number) => (
                        <CustomDrawerLink key={`drawer_link_${i}`} {...linkInfo} click={closeDrawer} />
                    ))}
                    <CustomDrawerLink label='Join Us' href='/register' icon={<IconRegistered />} click={closeDrawer} />
                </Stack>
                <NavLink label="Account" leftSection={<IconUserCircle />}>
                    {loggedIn ? (
                        <>
                            {accountLinks.filter(e => e.loginRequired === true).map((linkInfo: CustomDrawerLinkProps, i: number) => (
                                <CustomDrawerLink key={`drawer_link_loggedin_${i}`} {...linkInfo} click={closeDrawer} />
                            ))}
                            <LogoutLink />
                        </>
                    ) : (
                        <>
                            {accountLinks.filter(e => e.loginRequired === false).map((linkInfo: CustomDrawerLinkProps, i: number) => (
                                <CustomDrawerLink key={`drawer_link_account_${i}`} {...linkInfo} click={closeDrawer} />
                            ))}
                        </>
                    )}
                </NavLink>
                {/* <Box style={{ height: "30px" }}></Box> */}
            </Drawer>
        </AppShell>
    )
}

export default HeaderAndFooterWrapper