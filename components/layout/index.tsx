import { Layout, theme } from 'antd';
import styled from "styled-components";
import Sidebar from './sidebar';
import BreadcrumbLayoutComponents from './breadcrumb';
const { Header, Content } = Layout;

type Props = {
    children: JSX.Element;
};
const Navbar = styled(Header)`
    background-image: url('/images/page/layout/header.png');
    width: 100%;
    background-position: left;
    background-repeat: no-repeat;
    background-size: cover;
`

const LayoutComponents = ({ children }: Props) => {
    const { token: { colorBgContainer }, } = theme.useToken();
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout>
                <Navbar />
                <Content style={{ margin: '0 16px' }}>
                    <BreadcrumbLayoutComponents />
                    <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                        {children}
                    </div>
                </Content>
                {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
            </Layout>
        </Layout>
    )
}

export default LayoutComponents