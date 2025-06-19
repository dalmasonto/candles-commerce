import { Stack, Title } from '@mantine/core';
import HeaderAndFooterWrapper from '@/layouts/HeaderAndFooterWrapper';
import Head from 'next/head';
import { APP_NAME } from '@/config/constants';

function About() {
  return (
    <>
      <Head>
        <title>{`${APP_NAME} - About`}</title>
      </Head>
      <Stack>
        <Title>About Us </Title>
      </Stack>
    </>
  );
}


About.PageLayout = HeaderAndFooterWrapper

export default About