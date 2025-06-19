import { PRIMARY_DEEP_COLOR } from '@/config/constants'
import { ActionIcon, Card } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconPlayerPlay } from '@tabler/icons-react'
import React from 'react'
import ReactPlayer from 'react-player'

const HomePlayerIcon = () => {

    const showPlayerModal = () => modals.open({
        title: "Rhea Soil Health",
        size: 'xl',
        radius: 'lg',
        centered: true,
        children: (
            <>
                <Card p={0} radius={'lg'}>
                    <ReactPlayer url="https://youtu.be/6i4p2IfmzUY" width={'100%'} playing={true} />
                </Card>
            </>
        )
    })
    return (
        <ActionIcon onClick={showPlayerModal} size={'92px'} radius={'50%'} bg={PRIMARY_DEEP_COLOR}>
            <IconPlayerPlay size={'52px'} />
        </ActionIcon>
    )
}

export default HomePlayerIcon