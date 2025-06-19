import { Menu, Avatar, useMantineColorScheme, Button, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../providers/appProvider';
import Link from 'next/link';
import { isDarkMode, limitChars } from '../../config/config';
import { IconSettings, IconDashboard, IconLogout, IconLogin, IconUserPlus, IconUser, IconLogin2, IconArrowRight } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

function AccountBtn() {

    const { user, logout, login_status } = useAppContext();
    const [loggedInUser, setloggedInUser] = useState<any>(null)
    const [loggedIn, setLoggedIn] = useState(false)
    const { colorScheme } = useMantineColorScheme()

    const matches = useMediaQuery('(max-width: 1180px)');

    useEffect(() => {
        setLoggedIn(login_status ?? false)
        setloggedInUser(user || null)
    }, [login_status, user])

    return (
        <>
            {
                loggedIn ? (
                    <Menu shadow="md" width={230} radius="md" withArrow={false} arrowSize={16} position='bottom-end' transitionProps={{ transition: "slide-up" }} zIndex={3000}>
                        <Menu.Target>
                            <Avatar size={44} radius="xl" style={theme => ({
                                background: isDarkMode(colorScheme) ? theme.colors.dark[7] : theme.colors.gray[0],
                                cursor: "pointer",
                                textTransform: "uppercase",
                                zIndex: 3000,
                            })}
                                src={loggedInUser?.profile?.avatar?.image_url}>
                                {loggedInUser?.username ? loggedInUser.username[0] : <IconUser />}
                            </Avatar>
                        </Menu.Target>

                        <Menu.Dropdown p={'sm'}>
                            <Menu.Label>
                                {
                                    loggedIn ? (
                                        <>Welcome back {limitChars(loggedInUser?.username, 16)}</>
                                    ) : "Application"
                                }
                            </Menu.Label>
                            {
                                loggedIn ? (
                                    <>
                                        <Menu.Item leftSection={<IconSettings size={14} />} component={Link} href="/account">My Account</Menu.Item>
                                        {
                                            loggedInUser?.is_superuser ? (
                                                <>
                                                    <Menu.Divider />
                                                    <Menu.Item component={Link} href="/admin" leftSection={<IconDashboard size={14} />}>Admin</Menu.Item>
                                                </>
                                            ) : null
                                        }
                                        <Menu.Divider />
                                        <Menu.Item color="red" leftSection={<IconLogout size={14} />} onClick={logout}>Logout</Menu.Item>
                                    </>
                                ) : (
                                    <>
                                        <Menu.Item component={Link} href="/auth/login" leftSection={<IconLogin size={14} />}>Login</Menu.Item>
                                        <Menu.Item component={Link} href="/auth/signup" leftSection={<IconUserPlus size={14} />}>Sign Up</Menu.Item>
                                    </>
                                )
                            }
                        </Menu.Dropdown>
                    </Menu >
                ) : (
                    !matches ? (
                        <Group align='center' gap={4}>
                            {/* <Button component={Link} variant='transparent' href={'/auth/signup'} radius={'xl'} px={'25px'}>
                                Register
                            </Button> */}
                            <Button radius={'xl'} variant='transparent' component={Link} href={'/auth/login'}>
                                Login
                            </Button>
                        </Group>
                    ) : null
                )
            }
        </>
    );
}

export default AccountBtn