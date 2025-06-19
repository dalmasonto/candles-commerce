import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { Card, Checkbox, Group, Select } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import React from 'react'
import useSWR from 'swr'

interface ISelectCategoriesInput {
    form: any
    field_name: string
    hideLabel?: boolean
    size?: string
    multiple: boolean
}

const SelectCategoriesInput = (props: ISelectCategoriesInput) => {
    const { form, field_name, hideLabel, size, multiple } = props
    const [search, setSearchValue] = useDebouncedState('', 500);

    const URL = API_ENDPOINTS.CATEGORIES

    const { data, error, mutate, isLoading } = useSWR({
        url: URL, method: 'GET',
        params: { search, limit: 200 },
        useNext: false,
    }, makeRequestOne)

    const getCategoriesData = () => {
        try {
            return data?.data?.results ?? []
        } catch (error) {
            return []
        }
    }

    return (
        <>
            <Card radius={'md'}>
                {
                    multiple ? (
                        <Checkbox.Group
                            label="Select Categories"
                            description="Select all categories thay are needed"
                            withAsterisk
                            size={size ?? 'lg'}
                            {...form.getInputProps(field_name)}
                        >
                            <Group mt="xs">
                                {
                                    getCategoriesData().map((item: any) => (
                                        <Checkbox key={`category_${item?.id}`} value={`${item.id}`} label={item.title} />
                                    ))
                                }
                            </Group>
                        </Checkbox.Group>
                    ): (
                        <Select {...form.getInputProps(field_name)} nothingFoundMessage="Category not found"
                        data={getCategoriesData()?.map((cat: any) => ({
                            value: cat?.id?.toString(),
                            label: cat?.title,
                        }))}
                         searchable label={"Select Category"} placeholder='Select Category' radius={'md'} />
                    )
                }

            </Card>
        </>
    )
}

export default SelectCategoriesInput