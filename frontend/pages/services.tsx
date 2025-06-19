import { Stack, Title } from '@mantine/core';
import HeaderAndFooterWrapper from '@/layouts/HeaderAndFooterWrapper';
import Head from 'next/head';
import { APP_NAME } from '@/config/constants';

function Services() {
  return (
    <>
      <Head>
        <title>{`${APP_NAME} - Services`}</title>
      </Head>
      <Stack>
        <Title>Services </Title>
      </Stack>
    </>
  );
}


Services.PageLayout = HeaderAndFooterWrapper

export default Services