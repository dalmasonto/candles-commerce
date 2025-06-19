import { CustomPaginationForForm } from '@/components/common/CustomPagination'
import { Stack, Grid, NumberInput, TextInput, Select, Group, Button, Text, Slider } from '@mantine/core'
import { IconPlus, IconRefresh, IconSearch, IconX } from '@tabler/icons-react'
import React, { useEffect } from 'react'

interface SelectOption {
    value: string
    label: string
}

interface SelectGroup {
    group: string;
    items: SelectOption[];
}

interface SliderMark {
    value: string | number
    label: string
}

export interface FilterField {
    label: string
    accessor: string
    gridSize: number
    placeholder: string
    type: 'select' | 'text' | 'checkbox' | 'number' | 'slider'
    options?: SelectOption[] | SelectGroup[]
    marks?: SliderMark[]
}

interface IGlobalFilterFormAjax {
    fields: FilterField[]
    form: any
    setFilters: any
    defaultFilters: any
    pages: number
    count: number
    mutate: any
    addFunction?: any
    hideAddActionBtn?: boolean
}

const GlobalFilterFormAjax = (props: IGlobalFilterFormAjax) => {
    const { form, fields, pages, count, setFilters, defaultFilters, mutate, addFunction, hideAddActionBtn } = props

    function renderField(field: FilterField, i: number) {
        if (field.type === 'number') {
            return (
                <Grid.Col key={`field_${i}_${field.accessor}`} span={{ md: field.gridSize }}>
                    <NumberInput {...form.getInputProps(field.accessor)}
                        placeholder={field.placeholder}
                        hideControls
                        label={<Text size="sm">{field.label}</Text>} radius="md" />
                </Grid.Col>
            )
        }
        if (field.type === 'text') {
            return (
                <Grid.Col key={`field_${i}_${field.accessor}`} span={{ md: field.gridSize }}>
                    <TextInput {...form.getInputProps(field.accessor)}
                        placeholder={field.placeholder}
                        label={<Text size="sm">{field.label}</Text>} radius="md" />
                </Grid.Col>
            )
        }
        if (field.type === 'slider') {
            return (
                <Grid.Col key={`field_${i}_${field.accessor}`} span={{ md: field.gridSize }}>
                    {/* <Center className='h-100'> */}
                    <Stack className='h-100' gap={5}>
                        <Text size="sm">{field.label}</Text>
                        <Slider {...form.getInputProps(field.accessor)}
                            placeholder={field.placeholder}
                            radius="md"
                            marks={field.marks}
                            step={0.5}
                            min={0.5}
                            max={5}
                        />
                    </Stack>
                    {/* </Center> */}
                </Grid.Col>
            )
        }
        if (field.type === 'select') {
            return (
                <Grid.Col key={`field_${i}_${field.accessor}`} span={{ md: field.gridSize }}>
                    <Select {...form.getInputProps(field.accessor)}
                        label={<Text size="sm">{field.label}</Text>}
                        placeholder={field.placeholder}
                        radius="md"
                        data={field?.options || []}
                        maxDropdownHeight={300}
                        nothingFoundMessage="No options"
                        searchable
                    // filter={(value, item: any) =>
                    //     item.label.toLowerCase().includes(value.toLowerCase().trim())
                    // } 
                    />
                </Grid.Col>
            )
        }
        return <></>
    }

    const handleSearch = () => {
        setFilters(form.values)
    }

    const handleReset = () => {
        form.reset()
        setFilters(defaultFilters)
    }

    const handleRefresh = () => {
        mutate && mutate()
    }

    useEffect(() => {
        form.setFieldValue('page', 1)
    }, [form.values.limit, form.values.search])

    useEffect(() => {
        handleSearch()
    }, [form.values.page])

    return (
        <Stack>
            <form onSubmit={form.onSubmit((values: any) => handleSearch())}>
                <Grid>
                    {
                        fields.map((field: FilterField, i: number) => {
                            return renderField(field, i)
                        })
                    }
                    <Grid.Col span={{ md: 5 }}>
                        <Group className="h-100" align="end" justify="left">
                            <Button type="submit" size="sm" radius="md" variant="light" leftSection={<IconSearch size={16} />}>Search</Button>
                            <Button size="sm" radius="md" onClick={handleReset} color='red' variant="light" leftSection={<IconX size={16} />}>Reset</Button>
                            <Button size="sm" radius="md" onClick={handleRefresh} color='green' variant="light" leftSection={<IconRefresh size={16} />}>Refresh</Button>
                            {
                                hideAddActionBtn ? null : (
                                    <Button size="sm" radius="md" onClick={() => addFunction && addFunction()} color='indigo' variant="light" leftSection={<IconPlus size={16} />}>Add New</Button>
                                )
                            }
                            <Text style={{ fontWeight: 600 }} size="sm">Found: {count} records</Text>
                        </Group>
                    </Grid.Col>
                </Grid>
            </form>
            <Group style={{ textAlign: "center" }}>
                <CustomPaginationForForm pages={pages} form={form} />
            </Group>
        </Stack>
    )
}

export default GlobalFilterFormAjax