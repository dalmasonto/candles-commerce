import { Grid, Alert } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import React from 'react'

const CustomError = (props: any) => {
    const {msg} = props
    return (
        <Grid>
            <Grid.Col span={{md: 6}} offset={{md: 3}}>
                <Alert my="xl" icon={<IconAlertCircle size={16} />} title="An error occured" color="red" variant="filled">
                   {msg ? msg : "We encountered an error while loading the data."} 
                </Alert>
            </Grid.Col>
        </Grid>
    )
}

export default CustomError