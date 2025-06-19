import { Box, Group, Stack, Text, Title } from '@mantine/core'
import React from 'react'
import { PRIMARY_SHADE } from '../../config/constants'


interface LineProps {
    height?: string,
    width?: string,
    background?: string,
}

const Line = ({ height, width, background }: LineProps) => {

    return (
        <Box style={{ height: height ? height : "2px", width: width ? width : "6px", background: background ? background : PRIMARY_SHADE[0] }}></Box>
    )
}

interface HeadingProps {
    title: string,
    subtitle: string,
    description?: string,
    weight?: number 
}

export const HeadingOne = ({ title, subtitle, description, weight }: HeadingProps) => {

    return (
        <>
            <Stack align="center" gap={0}>
                <Group align="center" justify='center'>
                    <Line width='20px' />
                    <Text size="sm" fw={600} color={PRIMARY_SHADE[1]}>{subtitle}</Text>
                    <Line width='20px' />
                </Group>
                <Title order={3} c={PRIMARY_SHADE[2]} ta="center" fw={weight ? weight : 600}>{title}</Title>
                {description ? (
                    <Text size="sm" ta='center'>{description}</Text>
                ): null}
            </Stack>
        </>
    )
}
