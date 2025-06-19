import { Box, Button, Container, Group, Stack, Text, Title, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import HeaderAndFooterWrapper from '@/layouts/HeaderAndFooterWrapper';
import Head from 'next/head';
import { APP_NAME } from '@/config/constants';
import { IconBrandShopee, IconDashboard, IconLogin } from '@tabler/icons-react';
import Link from 'next/link';
import { useAppContext } from '@/providers/appProvider';
import { useEffect, useState } from 'react';

function HomePage() {
  const [localLoginStatus, setLocalLoginStatus] = useState(false)
  const theme = useMantineTheme();
  const { login_status } = useAppContext()
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    setLocalLoginStatus(login_status)
  }, [login_status])

  return (
    <>
      <Head>
        <title>{`${APP_NAME} - Admin Dashboard`}</title>
      </Head>
      <Container size="md" py={120}>
        <Stack align="center" gap="xl">
          <Group align="center" gap="md">
            <IconBrandShopee size={48} color={theme.colors.violet[5]} stroke={1.5} />
            <Title order={1} fw={700} size={48}>
              Candles & Fragrance
            </Title>
          </Group>

          <Title order={2} ta="center" mt="md">
            Admin Dashboard
          </Title>

          <Text size="lg" ta="center" c={isDark ? 'gray.4' : 'gray.7'} maw={600}>
            Welcome to the Candles & Fragrance admin portal. This dashboard provides tools to manage your e-commerce store, including products, orders, customers, and more.
          </Text>

          <Group mt="xl">
            <Button
              display={localLoginStatus ? "none" : "block"}
              component={Link}
              href="/auth/login"
              size="lg"
              radius="md"
              leftSection={<IconLogin size={20} />}
              variant="gradient"
              gradient={{ from: 'violet', to: 'indigo', deg: 90 }}
            >
              Login to Dashboard
            </Button>

            <Button
              component={Link}
              href="/admin"
              size="lg"
              radius="md"
              leftSection={<IconDashboard size={20} />}
              variant="outline"
              color="violet"
            >
              Go to Dashboard
            </Button>
          </Group>

          <Stack gap="xs" mt="xl" ta="center">
            <Text fw={500} size="lg">Features:</Text>
            <Text>✓ Product Management</Text>
            <Text>✓ Order Processing</Text>
            <Text>✓ Customer Data</Text>
            <Text>✓ Discount Codes</Text>
            <Text>✓ Sales Analytics</Text>
            <Text>✓ API Key Management</Text>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {}
  }
}

HomePage.PageLayout = HeaderAndFooterWrapper

export default HomePage

