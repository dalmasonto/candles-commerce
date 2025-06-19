import CustomCol from '@/components/common/CustomCol'
import { Grid, TextInput, Title, PasswordInput, Select } from '@mantine/core'
import { IconUser, IconMail, IconPassword } from '@tabler/icons-react'
import React, { ReactNode } from 'react'

interface ICreateUserFormJustInputs {
  form: any
  children: ReactNode
  updating: boolean
}

const CreateUserFormJustInputs = (props: ICreateUserFormJustInputs) => {
  const { form, children, updating } = props

  return (
    <div>
      <Grid>
        <CustomCol span={{ md: 6 }}>
          <TextInput leftSection={<IconUser size={16} />} radius="md" label="First Name" {...form.getInputProps('user.first_name')} placeholder='Enter first name' />
        </CustomCol>
        <CustomCol span={{ md: 6 }}>
          <TextInput leftSection={<IconUser size={16} />} radius="md" label="Last Name" {...form.getInputProps('user.last_name')} placeholder='Enter last name' />
        </CustomCol>
        <CustomCol span={{ md: 6 }}>
          <TextInput leftSection={<IconMail size={16} />} radius="md" label="Email" {...form.getInputProps('user.email')} placeholder='Enter email' />
        </CustomCol>
        <CustomCol span={{ md: 6 }}>
          <TextInput leftSection={<IconUser size={16} />} radius="md" label="Username" {...form.getInputProps('user.username')} placeholder='Enter username' />
        </CustomCol>
        <CustomCol span={{ md: 6 }}>
          <TextInput leftSection={<IconUser size={16} />} radius="md" label="Phone Number" {...form.getInputProps('user.profile.phone_number')} placeholder='Enter Phone Number' />
        </CustomCol>
        <CustomCol span={{ md: 6 }}>
          <Select leftSection={<IconUser size={16} />} radius="md"
            label="Gender" {...form.getInputProps('user.profile.gender')}
            placeholder='Select Gender'
            data={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'prefer_not_to_say', label: 'Prefer Not to Say' }
            ]} />
        </CustomCol>
        {
          children
        }
        {
          !updating ? (
            <>
              <CustomCol span={{ md: 12 }}>
                <Title order={3} fw={500}>Password Settings</Title>
              </CustomCol>
              <CustomCol span={{ md: 6 }}>
                <PasswordInput leftSection={<IconPassword size={16} />} size='sm' radius="md" label="Password" {...form.getInputProps('user.password')} placeholder="Enter password" />
              </CustomCol>
              <CustomCol span={{ md: 6 }}>
                <PasswordInput leftSection={<IconPassword size={16} />} size='sm' radius="md" label="Repeat Password" {...form.getInputProps('user.password_repeat')} placeholder="Repeat password" />
              </CustomCol>
            </>
          ) : null
        }
      </Grid>
    </div>
  )
}

export default CreateUserFormJustInputs