import React from 'react'
import Head from 'next/head';
import AddUserForm from '@/components/account/AddUserForm';
import { APP_NAME } from '@/config/constants';
import { Container, Grid, BackgroundImage, Paper, Center, Box, Stack, Title, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import HeaderAndFooterWrapper from '@/layouts/HeaderAndFooterWrapper';
import CreateUserForm from '@/components/forms/CreateUserForm';
import AuthPageBox from '@/components/auth/AuthPageBox';

const SignUP = () => {
  const matches = useMediaQuery('(max-width: 992px)');
  return (
    <>
      <Head>
        <title>{`Sign Up ${APP_NAME}`}</title>
        <meta name="description" content="Create a new account to get started. List businesses, list products, list services and shop on Sisi markets" />
      </Head>
      <AuthPageBox>
        <CreateUserForm />
      </AuthPageBox>
    </>
  )
}

SignUP.PageLayout = HeaderAndFooterWrapper;

export default SignUP