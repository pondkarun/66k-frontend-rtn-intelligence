import { Badge, Button, Col, Collapse, Layout, Menu, Modal, Row } from 'antd';
import { useSelector , useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import styled from "styled-components";
import Router from "next/router";
import { AppstoreOutlined, DownOutlined, MailOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons';
import { isArray } from 'lodash';
import { primary_color } from '@/pages/_app';
import { international_relations_topicsAttributes } from '@/interface/international_relations_topics.interface';
import { setObjToppic, setSelectCountry, setSelectToppic } from '@/redux/actions/toppicMenuActions';
import { setBackground } from '@/redux/actions/configActions';
import type {  MenuProps } from 'antd';
const { Sider } = Layout;


//#region -> styled
const H1 = styled("h1")`
   color: ${primary_color};
`
const ColText = styled(Col)`
   color: ${primary_color};
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

const Line = styled("div")`
    height: 0px;
    border: 1px solid ${primary_color};
    position: relative;
    margin: 2px 0px 10px 0px;
`

const MenuFlag = styled("div")`
   cursor: pointer;
   &.active {
     background: ${primary_color};
   }
   span {
     font-size: 18px;
     color: #fff;
   }
   &:hover {
     background: ${primary_color};
   }
`
const ColMenuFlag = styled(Col)`
    padding-top: 2px;
    text-align: start;
    padding-bottom: 5px;
`

const ModalIWG = styled(Modal)`
    table {
        width: 100%;
        border-collapse: collapse;
        th {
            border: 1px solid #dddddd;  
        }
        th:nth-child(1) {
            width: 60%;
        }
        th:nth-child(2) {
            width: 40%;
        }
    } 
`

const FlagIWG = styled("div")`
    text-align: center;
    padding: 15px;
    &.active {
        background: ${primary_color};
        .text {
            color: #fff;
            font-size: 18px;
        }
    }
    &:hover {
        background: ${primary_color};
        .text {
            color: #fff;
            font-size: 18px;
        }
    }
    img {
        width: 80px;
    }
    .text {
        font-size: 16px;
    }
`
const FlagIWGGroup = styled("div")`
    display: flex;
    flex-wrap: wrap;
`

const ButtonIWG = styled(Button)`
    margin-top: 10px;
    background-color: #ffffff00;
    border-color: ${primary_color};
    color: ${primary_color};
    width: 100%;
`
const CollapseToppic = styled(Collapse)`
    .ant-collapse-header-text , .ant-collapse-expand-icon {
        color: #fff
    }
    .ant-collapse-header {
        border-radius: 0 0 0 0 !important;
        border-bottom: 1px solid #fff;
        &:hover {
            border-bottom: 1px solid ${primary_color};
            .ant-collapse-header-text , .ant-collapse-expand-icon {
                color: ${primary_color};
            }
        }
    }
    .ant-collapse-content-box {
        padding-block: 0px !important;
        padding: 0px 0px !important;
        .toppic {
            padding: 10px 0px 10px 25px;
            color: #fff;
            border-bottom: 1px solid #fff;
            cursor: pointer;
            &:hover { 
                color: ${primary_color};
                border-bottom: 1px solid ${primary_color};
            }
            &.active { 
                color: ${primary_color};
                border-bottom: 1px solid ${primary_color};
            }
        }
    }
    .ant-collapse-item:last-child {
        border-radius: 0 0 0px 0px;
    }
   
`
const PanelToppic = styled(Collapse.Panel)``


const MenuSidebar = styled(Menu)`
    color: #fff;
    background: #ffffff00;
    .ant-menu-submenu-title {
        padding-left: 0px !important;
        border-radius: 0 0 0 0 !important;
        border-bottom: 1px solid #fff;
        width: 100%;
        margin-inline: 0px;
    } 
    .ant-menu-item {
        padding-left: 30px !important;
        &:hover {
            border-bottom: 1px solid ${primary_color};
            .ant-menu-title-content {
                color: ${primary_color};
            }
        }
    }
    .ant-menu-submenu-title {
        padding-inline-end: 15px;
        .ant-menu-title-content {
            padding-left: 15px !important;
        }
        &:hover {
            border-bottom: 1px solid ${primary_color};
            .ant-menu-title-content {
                color: ${primary_color};
            }
            svg {
                color: ${primary_color};
            }
        }
    }
    .ant-menu-item-selected {
        border-bottom: 1px solid ${primary_color};
        background-color: #e4b35400;
        color: #e4b354;
    }
    svg {
        font-size: 18px;
    }
    ul {
        color: #fff !important;
        background: #ffffff00 !important;
       li {
            border-radius: 0 0 0 0 !important;
            border-bottom: 1px solid #fff;
       }
      
    }
`

//#endregion

//#region -> SidebarLayoutComponents

type useSelectorAuth = {
    profile: any;
    topics: international_relations_topicsAttributes[];
    menus: any[];
}
const SidebarLayoutComponents = () => {
    const dispatch = useDispatch();
    const { country_group } = useSelector(({ country }) => country);
    const { profile, topics, menus }: useSelectorAuth = useSelector(({ auth }) => auth);
    const { country, toppic } = useSelector(({ toppic_menu }) => toppic_menu);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        dispatch(setBackground("#111730"));
    }, [])

    useEffect(() => {
        if (country && toppic) {
            dispatch(setBackground("#fff"));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [country, toppic])

    const Flag = styled("img")`
        width: 30px;
        ${collapsed ? `
            display:none;`
            : ``}
    `
    const findCountryGroup = (key: string) => {
        return country_group.find((w: any) => w.name == key)
    }

    const onClick = (id: string) => {
        dispatch(setSelectCountry(id))
        if (Router.pathname !== '/') Router.replace(`/international-relations-topics/${id}`);
        if (toppic) {
            Router.push(`/international-relations-topics/${id}/${toppic}`);
        }
    }

    /** menu */
    const [currentMenu, setCurrentMenu] = useState('mail');
    const [itemsMenu, setItemsMenu] = useState<any[]>([]);

    useEffect(() => {
        const menuItem: any[] = [];
        if (isArray(menus)) {
            menus.forEach(e => {
                const model: any = {
                    label: e.name,
                    key: e.id,
                    path: e.path ?? null,
                    children: []
                }
                if (isArray(e.children)) {
                    e.children.forEach((w: any) => {
                        model.children.push({
                            label: w.name,
                            key: w.id,
                            path: w.path
                        })
                    })
                }
                menuItem.push(model)
            })
        }
        // console.log('menuItem :>> ', menuItem);
        setItemsMenu(menuItem)
    }, [menus])

    const onClickMenu: MenuProps['onClick'] = (e) => {
        // console.log('click ', e);
        if (e.keyPath.length >= 2) {
            const find = itemsMenu.find(w => w.key == e.keyPath[1]);
            if (find) {
                const findChildren = find.children.find((w: any) => w.key == e.key);
                if (findChildren?.path) {
                    Router.push(findChildren.path);
                }
            }
        }
        setCurrentMenu(e.key);
    }

    return (
        <>
            <Sidebar width={350} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
                <div style={{ margin: "15px 10px 15px 10px" }} >
                    <section>
                        <Logo />
                        {!collapsed ?
                            <NameUser>
                                <div>{`${profile?.rank ?? ""} ${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`}</div>
                                <div>{profile?.position}</div>
                            </NameUser>
                            : null
                        }
                    </section>
                    <div style={{
                        overflow: 'auto',
                        maxHeight: '78vh',
                    }}>
                        <H1>เลือกประเทศ</H1>
                        <>
                            <Row>
                                <ColText span={8}>{findCountryGroup("อาเซียน")?.name}</ColText>
                                <ColText span={8}>{findCountryGroup("อาเซียน+9")?.name}</ColText>
                                <ColText span={8}>{findCountryGroup("อื่นๆ")?.name}</ColText>
                            </Row>
                            <Line />
                            <Row>
                                <ColText span={8}>
                                    {findCountryGroup("อาเซียน")?.countries.map((e: any) => (
                                        <MenuFlag key={e.id} id={e.id} className={e.id == country ? 'active' : ""} onClick={() => onClick(e.id)}>
                                            <Row>
                                                <ColMenuFlag span={8}><Flag width={40} src={e.icon_path} /></ColMenuFlag>
                                                <ColMenuFlag span={14} style={{ paddingTop: 5 }}><span>{e.initials_th}</span></ColMenuFlag>
                                            </Row>
                                        </MenuFlag>
                                    ))}
                                </ColText>
                                <ColText span={8}>
                                    {findCountryGroup("อาเซียน+9")?.countries.map((e: any) => (
                                        <MenuFlag key={e.id} id={e.id} className={e.id == country ? 'active' : ""} onClick={() => onClick(e.id)}>
                                            <Row>
                                                <ColMenuFlag span={8}><Flag width={40} src={e.icon_path} /></ColMenuFlag>
                                                <ColMenuFlag span={14} style={{ paddingTop: 5 }}><span>{e.initials_th}</span></ColMenuFlag>
                                            </Row>
                                        </MenuFlag>
                                    ))}
                                </ColText>
                                <ColText span={8}>
                                    {findCountryGroup("อื่นๆ")?.countries.map((e: any, index: number) => (
                                        <MenuFlag key={e.id} id={e.id} style={{ paddingBottom: 0 }} className={e.id == country ? 'active' : ""} onClick={() => onClick(e.id)}>
                                            <Row>
                                                <ColMenuFlag span={8}><Flag width={40} src={e.icon_path} /></ColMenuFlag>
                                                <ColMenuFlag span={14} style={{ paddingTop: 5 }}><span>{e.initials_th}</span></ColMenuFlag>
                                            </Row>
                                        </MenuFlag>
                                    ))}
                                </ColText>

                            </Row>

                            <IonsWorkingGroups countries={findCountryGroup("IONS Working Groups")?.countries} />

                            <H1 style={{ paddingTop: 20 }}>หัวข้อความสัมพันธ์ระหว่างประเทศ</H1>
                            {country ? <ToppicMenu list={topics} /> : <p style={{ textAlign: "center", color: "#fff" }}>- กรุณาเลือกประเทศ -</p>}

                            {itemsMenu.length > 0 ? (
                                <>
                                    <H1 style={{ paddingTop: 20 }}>เมนู</H1>
                                    <Menu className='ant-customize-menu' theme="dark" expandIcon={(props) => (
                                        // eslint-disable-next-line react/prop-types
                                        props.isOpen ? <DownOutlined /> : <RightOutlined />
                                    )} onClick={onClickMenu} selectedKeys={[currentMenu]} items={itemsMenu} mode="inline" />
                                </>
                            ) : null}
                        </>
                    </div>
                </div>
            </Sidebar >
        </>
    )
}
//#endregion

//#region -> IonsWorkingGroups
const IonsWorkingGroups = ({ countries }: { countries: any[] }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [memberฉountries, setMemberฉountries] = useState<any[]>([]);
    const [observerฉountries, setObserverCountries] = useState<any[]>([]);
    const { country } = useSelector(({ toppic_menu }) => toppic_menu);

    useEffect(() => {
        if (countries) {
            // 1 คือ สมาชิก 2 คือ ผู้สังเกตการณ์
            setMemberฉountries(countries.filter(w => w.status === 1))
            setObserverCountries(countries.filter(w => w.status === 2))
        }
    }, [countries])


    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };

    const onClick = (id: string) => {
        dispatch(setSelectCountry(id))
    };

    return (
        <>
            <ButtonIWG style={{ marginTop: 10 }} onClick={showModal}>IONS Working Groups</ButtonIWG>
            <ModalIWG
                bodyStyle={{
                    maxHeight: 700,
                    overflowY: "auto"
                }}
                width={"70vw"}
                title={"IONS Working Groups"}
                open={open}
                onOk={hideModal}
                onCancel={hideModal}
                footer={null}
            >
                <p style={{ color: "#00408E" }}>PARTICIPATING NATIONS</p>
                <table>
                    <tbody>
                        <tr>
                            <th>สมาชิก</th>
                            <th>ผู้สังเกตการณ์</th>
                        </tr>
                        <tr>
                            <td style={{ borderRight: "1px solid #dddddd" }}>
                                <FlagIWGGroup>
                                    {memberฉountries.map((e: any) => (
                                        <FlagIWG key={e.icon_path} onClick={() => onClick(e.id)} className={e.id == country ? 'active' : ""}>
                                            <img src={e.icon_path} />
                                            <div className='text'>{e.initials_th}</div>
                                        </FlagIWG>
                                    ))}
                                </FlagIWGGroup>
                            </td>
                            <td style={{ display: "flex" }}>
                                <FlagIWGGroup>
                                    {observerฉountries.map((e: any) => (
                                        <FlagIWG key={e.icon_path} onClick={() => onClick(e.id)} className={e.id == country ? 'active' : ""}>
                                            <img src={e.icon_path} />
                                            <div className='text'>{e.initials_th}</div>
                                        </FlagIWG>
                                    ))}
                                </FlagIWGGroup>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </ModalIWG>
        </>
    )
}
//#endregion

//#region -> ToppicMenu

const ToppicMenu = ({ list, index }: { list: international_relations_topicsAttributes[], index?: string }) => {
    const dispatch = useDispatch();
    const { toppic, country } = useSelector(({ toppic_menu }) => toppic_menu);

    const onChange = (value: any) => {
        // console.log('value :>> ', value);
    }
    const onClick = (id: string) => {
        // console.log('id :>> ', id);
        dispatch(setSelectToppic(id))
        Router.push(`/international-relations-topics/${country}/${id}`);
    }
    return (
        <>
            <CollapseToppic ghost expandIconPosition={"end"} onChange={onChange}>
                {list.map((e: any, i) => {
                    const is_last_node = e.children.filter((w: any) => w.last_node == true);
                    return (
                        (is_last_node.length == 0) ?
                            <PanelToppic header={`${index ? `${index}.` : ""}${i + 1}. ${e.name}`} key={e.id}>
                                <ToppicMenu list={e.children} index={`${index ? `${index}.` : ""}${i + 1}`} />
                            </PanelToppic>
                            :
                            <PanelToppic header={`${index ? `${index}.` : ""}${i + 1}. ${e.name}`} key={e.id}>
                                {is_last_node.map((_e: any, _i: number) => (
                                    <div key={_e.id} className={`toppic ${_e.id == toppic ? 'active' : ""}`} onClick={() => onClick(_e.id)}>{`${index ? `${index}.` : ""}${i + 1}.${_i + 1} ${_e.name}`}</div>
                                ))}
                            </PanelToppic>
                    )
                })}
            </CollapseToppic>
        </>
    )
}
//#endregion

export default SidebarLayoutComponents