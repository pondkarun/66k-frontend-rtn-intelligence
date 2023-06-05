import { Layout, theme } from 'antd';
import Sidebar from './sidebar';
import Navbar from './navbar';
import BreadcrumbLayoutComponents from './breadcrumb';
const { Content } = Layout;

type Props = {
    children: JSX.Element;
};


const LayoutComponents = ({ children }: Props) => {
    const { token: { colorBgContainer }, } = theme.useToken();
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout style={{ background: "#EAEAEA" }}>
                <Navbar />
                <BreadcrumbLayoutComponents />
                <Content style={{ margin: '0 16px' }}>
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