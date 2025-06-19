import { Button } from '@mantine/core'
import { IconPlant2 } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'


interface IBookSoilTestHeaderBtn {
    size?: any
}
const BookSoilTestHeaderBtn = (props: IBookSoilTestHeaderBtn) => {
    const { size } = props

    return (
        <Button size={size ?? 'md'} component={Link} className='animated-button' variant='gradient' gradient={{ from: 'green', to: 'yellow' }} href={'/book-soil-test'} radius={'xl'}
            px={'25px'} leftSection={<IconPlant2 />}>
            Book Soil Test
        </Button>
    )
}

export default BookSoilTestHeaderBtn