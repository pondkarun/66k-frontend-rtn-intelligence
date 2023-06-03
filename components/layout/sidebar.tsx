import { Badge, Form, Input, Layout, Menu, Space } from 'antd';
import { SearchOutlined, } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import styled from "styled-components";
import { primary_color } from '@/pages/_app';
const { Sider } = Layout;

const Sidebar = styled(Sider)`
    .ant-layout-sider-children {
        background-image: url('/images/page/layout/sidebar.png');
    }
`
const Logo = styled("div")`
    height: 110px;
    background-image: url('/images/page/layout/logo.png');
    width: 100%;
    background-position: left;
    background-repeat: no-repeat;
    background-size: cover;
    margin-bottom: 30px;
`
const NameUser = styled("div")`
    position: absolute;
    top: 81px;
    left: 138px;
    
    div {
        color: #fff
    }
`

const FormSearch = styled(Form)`
    .ant-input-affix-wrapper {
        background-color: #ffffff00;
        color: #FFFFFF;
        border-width: 0px;
        border-bottom: 1px solid #FFFFFF;
        border-radius: 0px;
        opacity: 0.6;
        &:hover {
            border-color: #ffffff;
            border-inline-end-width: 0px;
            opacity: 0.8;
        }
        .ant-input {
            background-color: #ffffff00;
            color: #FFFFFF;
            padding-left: 15px;
        }
        .anticon.ant-input-password-icon {
            color: #FFFFFF;
            cursor: pointer;
            transition: all 0.3s;
        }
        input::placeholder {
            color: #FFFFFF;
        }
        
       
    }
    .ant-input-affix-wrapper-status-error {
        input::placeholder {
            color: #ff4d4f;
        }
    }
`

const MenuList = styled(Menu)`
    .ant-menu-item-selected {
        background-color: #96c0ff70;
        border-radius: 5px;
    }
`

const BadgeValue = styled(Badge)`
    min-width: 34px;
    max-height: 20px;
    margin-bottom: 5px;
`
const BadgeNonValue = styled(Badge)`
    max-height: 20px;
    margin-bottom: 5px;
    sup {
        background: rgba(255, 6, 32, 0.2) !important;
        color: #F55061 !important;
        box-shadow: 0 0 0 1px #FF0620 !important;
    }
`

const Line = styled("div")`
    height: 0px;
    border: 1px solid ${primary_color};
    position: relative;
    margin: 20px 5px 20px 5px;
`


type MenuItem = Required<MenuProps>['items'][number];
const SidebarLayoutComponents = () => {

    const [collapsed, setCollapsed] = useState(false);

    const Flag = styled("img")`
        width: ${!collapsed ? 40 : 30}px;
        margin-right: 10px;
    
        `
    const getName = (name: string, value?: number | null) => {
        return (
            <Space>
                <span style={{ fontSize: 22 }}>{name}</span> {value ?
                    <BadgeValue count={`${value}`} showZero color='#0066FF' size="small" /> :
                    <BadgeNonValue count={`non-data`} showZero color='#F55061' size="small" />}
            </Space>
        )
    }

    const getItem = (label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem => {
        return {
            key,
            icon,
            children,
            label,
        } as MenuItem;
    }

    const itemsData: MenuItem[] = [
        getItem(getName('Ethiopia', 11), '001', <Flag width={40} src="/images/flag_icon/001-ethiopia.png" />),
        getItem(getName('Oman', 9), '002', <Flag width={40} src="/images/flag_icon/002-oman.png" />),
        getItem(getName('Tanzania', 5), '003', <Flag width={40} src="/images/flag_icon/003-tanzania.png" />),
    ];

    const itemsNonData: MenuItem[] = [
        getItem(getName('Slovenia', null), '004', <Flag width={40} src="/images/flag_icon/004-slovenia.png" />),
        getItem(getName('Puerto Rico', null), '005', <Flag width={40} src="/images/flag_icon/005-puerto-rico.png" />),
    ];

    return (
        <Sidebar width={300} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
            <div style={{ margin: 15 }} >
                <section>
                    <Logo />
                    {!collapsed ?
                        <NameUser>
                            <div>น.อ.วรุณ วีระกุล</div>
                            <div>ผชท.ทร.ไทย/ฮานอย</div>
                        </NameUser>
                        : null
                    }
                </section>
                <section style={{ marginBottom: 20 }}>
                    {!collapsed ?
                        <FormSearch
                            name="search"
                            autoComplete="off"
                        >
                            <Input prefix={<SearchOutlined />} placeholder="ค้นหาจากชื่อประเทศ" />
                        </FormSearch>
                        : null
                    }
                </section>
                <div style={{
                    overflow: 'auto',
                    height: '70vh',
                }}>
                    <MenuList theme="dark" defaultSelectedKeys={['001']} mode="inline" items={itemsData} style={{ background: "#00152900" }} />
                    <Line />
                    <MenuList theme="dark" defaultSelectedKeys={['001']} mode="inline" items={itemsNonData} style={{ background: "#00152900" }} />
                </div>
            </div>
        </Sidebar>
    )
}

export default SidebarLayoutComponents