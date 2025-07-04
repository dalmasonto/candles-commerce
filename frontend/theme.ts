import { createTheme } from '@mantine/core';

import { Bai_Jamjuree, Playfair_Display, Montserrat, Cormorant_Garamond, Lato, Libre_Baskerville } from 'next/font/google'

const bai = Bai_Jamjuree({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin']
})
const playfair_display = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
})

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
})

const cormorant_garamond = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin']
})

const lato = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin']
})

const libre_baskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin']
})

export const theme = createTheme({
  // fontFamily: bai.style.fontFamily,
  fontFamily: lato.style.fontFamily,
  primaryColor: 'orange',
});
