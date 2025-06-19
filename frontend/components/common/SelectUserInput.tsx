import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { useAppContext } from '@/providers/appProvider'
import { Loader, Select } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { IconPlant } from '@tabler/icons-react'
import React from 'react'
import useSWR from 'swr'

interface ISelectUserInput {
    form: any
    field_name: string
}

const SelectUserInput = (props: ISelectUserInput) => {
    const { form, field_name } = props
    const { token } = useAppContext()

    const [search, setSearchValue] = useDebouncedState('', 500);
    const URL = API_ENDPOINTS.USERS
    const { data, error, mutate, isLoading } = useSWR({
        url: URL, method: 'GET',
        params: { search, limit: 5, fields: 'id,full_name' },
        useNext: false,
        extra_headers: {
            Authorization: `Bearer ${token}`
        }
    }, makeRequestOne)

    const getCropsData = () => {
        try {
            return data?.data?.results
        } catch (error) {
            return []
        }
    }

    return (
        <Select clearable leftSection={isLoading ? <Loader size={'sm'} color='white' /> : <IconPlant size={16} />} radius="md" label="User" {...form.getInputProps(field_name)}
            placeholder='Select User'
            defaultSearchValue={search}
            onSearchChange={e => setSearchValue(e)}
            data={getCropsData()?.map((item: any) => (({
                value: `${item?.id}`,
                label: `${item?.full_name}`,
            }))) || []} nothingFoundMessage="User not found" searchable />
    )
}

export default SelectUserInput