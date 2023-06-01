import type { AppProps } from "next/app";
import Head from "next/head";
import { ConfigProvider } from 'antd';

import 'antd/dist/reset.css';
import '../styles/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>ระบบข้อมูลความสัมพันธ์ ระหว่างประเทศ</title>
            </Head>
            <ConfigProvider theme={{
                token: {
                    // colorPrimary: '#13A6FD',
                    fontFamily: 'MNPimai',
                    fontSize: 18
                },
            }}>
                <Component {...pageProps} />
            </ConfigProvider>
        </>
    )
}