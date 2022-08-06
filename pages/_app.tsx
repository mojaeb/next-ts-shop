import { AppProps } from 'next/app'
import React from 'react'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { StoreProvider } from '../components/StoreState'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <StoreProvider>
            <Component {...pageProps} />
        </StoreProvider>
    )
}

export default MyApp
