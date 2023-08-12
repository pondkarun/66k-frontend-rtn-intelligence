import { Layout, Spin, theme } from 'antd';
import Sidebar from './sidebar';
import Navbar from './navbar';
import BreadcrumbLayoutComponents from './breadcrumb';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
const { Content } = Layout;

type Props = {
    children: JSX.Element;
};

//#region -> styled
const LoadingDiv = styled("div")`
    margin: 20px 0;
    background: rgb(0 0 0 / 54%);
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100vh;
    top: -14px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .ant-spin-dot {
        font-size: 1rem;
        i {
            width: 80px;
            height: 80px;
        }
    }
`
//#endregion

const LayoutComponents = ({ children }: Props) => {
    const { loading, background } = useSelector(({ configs }) => configs);
    return (
        <Layout style={{ minHeight: '100vh' }}>

            {loading ? <LoadingDiv className="example">
                <Spin size="large" />
            </LoadingDiv> : null}

            <Sidebar />
            <Layout style={{ background: "#EAEAEA" }}>
                <Navbar />
                <BreadcrumbLayoutComponents />
                <Content style={{ margin: '0 16px' }}>
                    <div style={{ padding: 24, minHeight: 360, background: background, maxHeight: "87dvh", overflowY: "auto" }}>
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}


export default LayoutComponents