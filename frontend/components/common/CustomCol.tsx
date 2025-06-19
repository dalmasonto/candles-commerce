import { Grid } from "@mantine/core"

const CustomCol = (props: any) => {
    const { children, ...rest } = props
    return (
        <Grid.Col {...rest}>
            {children}
        </Grid.Col>
    )
}

export default CustomCol