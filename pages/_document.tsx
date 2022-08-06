import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

interface IProps {
    styleTags: unknown
}

class MyDocument extends Document<IProps> {
    render(): JSX.Element {
        return (
            <Html lang={'fa'}>
                <Head>
                    <link
                        href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css"
                        rel="stylesheet"
                        type="text/css"
                    />
                    <link rel="shortcut icon" href="/logo.ico" />
                    <link rel="icon" href="/logo.ico" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
