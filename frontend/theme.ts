import { createTheme } from '@mantine/core';

import { Bai_Jamjuree } from 'next/font/google'

const bai = Bai_Jamjuree({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin']
})


export const theme = createTheme({
  fontFamily: bai.style.fontFamily,
  primaryColor: 'orange',
});
