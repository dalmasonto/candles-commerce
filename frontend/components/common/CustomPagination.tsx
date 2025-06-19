import { Box, Pagination, getGradient } from '@mantine/core'
import React from 'react'
import Link from 'next/link'
import { updatePageFilter } from '@/config/functions'

interface PaginationProps {
    pages: number,
    setPage?: any,
    active?: any,
    pageURL?: string,
    form?: any
}

const CustomPagination = (props: PaginationProps) => {
    const { pages, setPage, active } = props
    return (
        <>
            {
                pages > 1 ? (
                    <Pagination
                        value={active || 1}
                        total={pages ? Math.ceil(pages) : 1}

                        onChange={page => setPage(page)}
                    />
                ) : null
            }
        </>
    )
}

export const CustomPaginationForForm = (props: PaginationProps) => {
    const { pages, form } = props
    return (
        <>
            {
                pages > 1 ? (
                    <Pagination
                        total={pages ? Math.ceil(pages) : 1}
                        justify="left"
                        {...form.getInputProps('page')}
                    />
                ) : null
            }
        </>
    )
}

const CustomLink = (props: any) => {
    return (
        <Box component={Link} href={props?.href}>
            <a {...props} />
        </Box>
    )
}

export const CustomLinkPagination = (props: PaginationProps) => {
    const { pages, setPage, active, pageURL } = props
    return (
        <>
            {
                pages > 1 ? (
                    <Pagination
                        value={parseInt(active)}
                        total={pages}
                        withControls={false}
                        getItemProps={(page) => ({
                            component: CustomLink,
                            // href: `${pageURL}?page=${page}`,
                            href: updatePageFilter(pageURL ?? '', page)
                        })}
                        style={(theme) => ({
                            control: {
                                '&[data-active]': {
                                    backgroundImage: getGradient({ deg: 180, from: 'red', to: 'yellow' }, theme),
                                },
                            },
                        })}
                    />
                ) : null
            }
        </>
    )
}

export default CustomPagination