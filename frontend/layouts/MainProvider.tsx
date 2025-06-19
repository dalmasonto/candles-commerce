import { MantineColorScheme, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications'
import React from 'react'
import AppProvider from '../providers/appProvider';
import { CustomColorSchemeManager } from '@/components/ColorSchemeToggle/CustomColorSchemeManager';
import { THEME_COOKIE_NAME } from '@/config/constants';
import { theme } from '@/theme';

interface MainProviderProps {
    colorScheme: MantineColorScheme,
    children: React.ReactNode,
}

const MainProvider = ({ colorScheme, children }: MainProviderProps) => {

    return (
        <AppProvider>
            <MantineProvider colorSchemeManager={CustomColorSchemeManager({ key: THEME_COOKIE_NAME })} defaultColorScheme={colorScheme}
                theme={theme} >
                <ModalsProvider>
                    {children}
                </ModalsProvider>
                <Notifications position='bottom-right' transitionDuration={200} autoClose={3000}/>
            </MantineProvider>
        </AppProvider>
    )
}

export default MainProvider