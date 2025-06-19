import React from 'react'
import NextApp, { AppProps, AppContext } from 'next/app';
import Head from 'next/head'
import { getCookie } from 'cookies-next'
import MainProvider from '../layouts/MainProvider'
import { APP_NAME, FAV_ICON_URL, THEME_COOKIE_NAME } from '../config/constants'
import { MantineColorScheme } from '@mantine/core';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import './../styles/global.css'
import '@mantine/charts/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/tiptap/styles.css';

import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import '@/styles/tiptap.scss'

// This is to allow different pages to have different layouts since we are not using the app directory.
type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType<{ children: React.ReactNode }>,
  },
  colorScheme: MantineColorScheme,
  user: any,
  loginStatus: any,
}

export default function App({ Component, pageProps, colorScheme, loginStatus }: ComponentWithPageLayout) {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <link rel="icon" type="image/x-icon" href={FAV_ICON_URL} />
      </Head>
      <MainProvider colorScheme={colorScheme}>
        {
          Component.PageLayout ? (
            <Component.PageLayout>
              <Component {...pageProps} />
            </Component.PageLayout>
          )
            :
            <Component {...pageProps} />
        }
      </MainProvider>
    </>
  );
}


App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie(THEME_COOKIE_NAME, appContext.ctx) || 'dark',
    // user: getCookie(LOCAL_STORAGE_KEYS.user, appContext.ctx) || null,
    // loginStatus: getCookie(LOCAL_STORAGE_KEYS.login_status, appContext.ctx) || false,
  };
};