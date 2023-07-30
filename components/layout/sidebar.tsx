import { Badge, Col, Layout, Menu, Row, Space } from 'antd';
import { useSelector } from 'react-redux';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import styled from "styled-components";
import { primary_color } from '@/pages/_app';
const { Sider } = Layout;

const H1 = styled("h1")`
   color: ${primary_color};
`
const ColText = styled(Col)`
   color: ${primary_color};
//    text-align: center;
`

const Sidebar = styled(Sider)`
    .ant-layout-sider-children {
        background-image: url('/images/page/layout/sidebar.png');
        width: 100%;
        background-position: left;
        background-repeat: no-repeat;
        background-size: cover;
    }
`
const Logo = styled("div")`
    height: 113px;
    background-image: url('/images/page/layout/logo.png');
    width: 80%;
    background-position: left;
    background-repeat: no-repeat;
    background-size: cover;
    margin-bottom: 20px;
`
const NameUser = styled("div")`
    position: absolute;
    top: 81px;
    left: 138px;
    div {
        color: #fff
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
    margin: 2px 0px 10px 0px;
`

const MenuFlag = styled("div")`
   text {
     font-size: 18px;
     color: #fff;
   }
`
const ColMenuFlag = styled(Col)`
    padding-top: 2px;
    text-align: start;
    padding-bottom: 5px;
`


type MenuItem = Required<MenuProps>['items'][number];
const SidebarLayoutComponents = () => {
    const { country_group } = useSelector(({ country }) => country);
    const [collapsed, setCollapsed] = useState(false);

    const Flag = styled("img")`
        width: 30px;
        ${collapsed ? `
            display:none;`
            : ``}
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

    const findCountryGroup = (key: string) => {
        return country_group.find((w: any) => w.name == key)
    }

    return (
        <Sidebar width={350} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
            <div style={{ margin: "15px 10px 15px 10px" }} >
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
                <div style={{
                    overflow: 'auto',
                    height: '70vh',
                }}>
                    <H1>เลือกประเทศ</H1>
                    <Row>
                        <ColText span={8}>{findCountryGroup("อาเซียน")?.name}</ColText>
                        <ColText span={8}>{findCountryGroup("อาเซียน+9")?.name}</ColText>
                        <ColText span={8}>{findCountryGroup("อื่นๆ")?.name}</ColText>
                    </Row>
                    <Line />
                    <Row>
                        <ColText span={8}>
                            {findCountryGroup("อาเซียน")?.countries.map((e: any) => (
                                <MenuFlag key={e.id}>
                                    <Row>
                                        <ColMenuFlag span={8}><Flag width={40} src={e.icon_path} /></ColMenuFlag>
                                        <ColMenuFlag span={14} style={{ paddingTop: 5 }}><text>{e.initials_th}</text></ColMenuFlag>
                                    </Row>
                                </MenuFlag>
                            ))}
                        </ColText>
                        <ColText span={8}>
                            {findCountryGroup("อาเซียน+9")?.countries.map((e: any) => (
                                <MenuFlag key={e.id}>
                                    <Row>
                                        <ColMenuFlag span={8}><Flag width={40} src={e.icon_path} /></ColMenuFlag>
                                        <ColMenuFlag span={14} style={{ paddingTop: 5 }}><text>{e.initials_th}</text></ColMenuFlag>
                                    </Row>
                                </MenuFlag>
                            ))}
                        </ColText>
                        <ColText span={8}>
                            {findCountryGroup("อื่นๆ")?.countries.map((e: any, index: number) => (
                                <MenuFlag key={e.id} style={{ paddingBottom: 0 }}>
                                    <Row>
                                        <ColMenuFlag span={8}><Flag width={40} src={e.icon_path} /></ColMenuFlag>
                                        <ColMenuFlag span={14} style={{ paddingTop: 5 }}><text>{e.initials_th}</text></ColMenuFlag>
                                    </Row>
                                </MenuFlag>
                            ))}
                        </ColText>

                    </Row>
                </div>
            </div>
        </Sidebar>
    )
}

export default SidebarLayoutComponents