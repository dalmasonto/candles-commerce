import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { Loader, Select } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { IconLocation } from '@tabler/icons-react'
import React from 'react'
import useSWR from 'swr'

interface ISelectCountryInput {
    form: any
    field_name: string
    hideLabel?: boolean
}

const SelectCountryInput = (props: ISelectCountryInput) => {
    const { form, field_name, hideLabel } = props
    const [search, setSearchValue] = useDebouncedState('', 500);
    const URL = API_ENDPOINTS.COUNTRIES
    const { data, error, mutate, isLoading } = useSWR({
        url: URL, method: 'GET',
        params: { search, limit: 5 },
        useNext: false,
    }, makeRequestOne)

    const getCountriesDaata = () => {
        try {
            return data?.data?.results
        } catch (error) {
            return []
        }
    }

    return (
        <Select clearable leftSection={isLoading ? <Loader size={'sm'} color='white' /> : <IconLocation size={16} />} radius="md" label={hideLabel ? null : "County"} {...form.getInputProps(field_name)}
            placeholder='Select Country'
            data={getCountriesDaata()?.map((item: any) => (({
                value: `${item?.id}`,
                label: `${item?.name}`,
            }))) || []} />
    )
}

export default SelectCountryInput