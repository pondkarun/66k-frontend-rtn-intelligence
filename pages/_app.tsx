import type { AppProps } from "next/app";
import { wrapper } from '../redux/store'
import Head from "next/head";
import { ConfigProvider } from 'antd';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

import 'antd/dist/reset.css';
import '../styles/globals.scss';

export const primary_color = "#E4B354"
export const imgSrc = "/images/page/login/logo.png"
export const version = publicRuntimeConfig?.version

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <title>ระบบข้อมูลความสัมพันธ์ ระหว่างประเทศ</title>
            </Head>
            <ConfigProvider theme={{
                token: {
                    colorPrimary: primary_color,
                    fontFamily: 'MNPimai',
                    fontSize: 21
                },
            }}>
                <Component {...pageProps} />
            </ConfigProvider>
        </>
    )
}

export default wrapper.withRedux(App);