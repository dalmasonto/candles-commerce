import { isDarkMode } from "@/config/config"
import { Box, useMantineColorScheme } from "@mantine/core"
import { ReactNode } from "react"

interface IWrapperBox {
    color: string
    children: ReactNode
    extraStyles?: any
}

const WrapperBox = (props: IWrapperBox) => {
    const { color, children, extraStyles } = props
    const { colorScheme } = useMantineColorScheme()
    return (
        <Box p={'md'} style={theme => ({
            background: isDarkMode(colorScheme) ? theme.colors.dark[6] : theme.colors["gray"][3],
            borderRadius: theme.radius.lg,
            ...extraStyles
        })}>
            {children}
        </Box>
    )
}

export default WrapperBox