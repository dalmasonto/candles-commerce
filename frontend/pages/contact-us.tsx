import { ActionIcon, Anchor, Box, Container, Divider, Grid, Group, Stack, Text, Title, Tooltip, darken, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import HeaderAndFooterWrapper from '@/layouts/HeaderAndFooterWrapper';
import Head from 'next/head';
import { APP_NAME } from '@/config/constants';
import ContactCreateForm from '@/components/forms/more_forms/ContactCreateForm';
import { isDarkMode } from '@/config/config';
import { IconBrandFacebook, IconBrandTwitter, IconBrandWhatsapp, IconBrandYoutube, IconMail, IconPhoneCall } from '@tabler/icons-react';
import WrapperBox from '@/components/common/WrapperBox';
import { ReactNode } from 'react';

interface ISocialIcon {
  title: string
  url: string
  color: string
  icon: ReactNode
}

const SocialIcon = (props: ISocialIcon) => {
  const { title, url, color, icon } = props
  return (
    <Tooltip label={title} color={color}>
      <Anchor href={url} target='_blank'>
        <ActionIcon color={color} size={'42px'} radius={'md'} variant='light'>
          {icon}
        </ActionIcon>
      </Anchor>
    </Tooltip>
  )
}

const socialLinks: ISocialIcon[] = [
  {
    title: "Facebook",
    url: "#",
    color: "blue",
    icon: <IconBrandFacebook />
  },
  {
    title: "Twitter",
    url: "#",
    color: "indigo",
    icon: <IconBrandTwitter />
  },
  {
    title: "YouTube",
    url: "#",
    color: "red",
    icon: <IconBrandYoutube />
  },
  {
    title: "Whatsapp",
    url: "#",
    color: "green",
    icon: <IconBrandWhatsapp />
  },
]

function ContactUs() {
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()

  return (
    <>
      <Head>
        <title>{`${APP_NAME} - Contact Us`}</title>
      </Head>
      <Stack>
        <Box py={'70px'} bg={isDarkMode(colorScheme) ? darken(theme.colors[theme.primaryColor][9], 0.5) : theme.colors[theme.primaryColor][8]}>
          <Title size={'52px'} ta={'center'} c="white">Get In Touch</Title>
          <Text size="lg" fw={500} c="white" ta={'center'}>Quickly talk to us</Text>
        </Box>
        <Container size={"lg"} py={"70px"}>
          <Grid>
            <Grid.Col span={{ md: 6 }}>
              <Box p={{ md: '40px' }} bg={isDarkMode(colorScheme) ? theme.colors.dark[6] : theme.colors.gray[1]} style={{
                borderRadius: theme.radius.lg
              }}>
                <Stack p="lg">
                  <Title order={2} size={'32px'}>Send Message</Title>
                  <Text>Write us a message and we will respond to you quickly</Text>
                  <ContactCreateForm />
                </Stack>
              </Box>
            </Grid.Col>
            <Grid.Col span={{ md: 6 }} p={{ md: '40px' }}>
              <Stack px="lg">
                <Divider
                  my="xs"
                  variant="solid"
                  size={4}
                  color='green'
                  fw={600}
                  labelPosition="center"
                  label={
                    <>
                      <IconPhoneCall size={22} />
                      <Text ml={5} fw={600} size='22px'>OR</Text>
                    </>
                  }
                />
                <WrapperBox color='yellow'>
                  <Group wrap='nowrap'>
                    <ActionIcon color='yellow' radius={'md'} size={'42px'}>
                      <IconMail />
                    </ActionIcon>
                    <Stack gap={2}>
                      <Text fw={600} size='lg'>Email uS</Text>
                      <Anchor href="mailto:info@kibokodao.org">
                        <Text fw={500} size='md' c={isDarkMode(colorScheme) ? 'white' : 'dark'}>
                          info@kibokodao.org
                        </Text>
                      </Anchor>
                    </Stack>
                  </Group>
                </WrapperBox>
                <WrapperBox color='violet'>
                  <Stack gap={10}>
                    <Title order={3}>Our Socials</Title>
                    <Group gap={20} justify='space-evenly'>
                      {
                        socialLinks?.map((item: ISocialIcon, i: number) => (
                          <SocialIcon key={`social_${i}_${item.title}`} {...item} />
                        ))
                      }
                    </Group>
                  </Stack>
                </WrapperBox>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Stack>
    </>
  );
}


ContactUs.PageLayout = HeaderAndFooterWrapper

export default ContactUs

