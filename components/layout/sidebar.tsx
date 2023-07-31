import { Badge, Button, Col, Collapse, Layout, Modal, Row } from 'antd';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import styled from "styled-components";
import { primary_color } from '@/pages/_app';
import { international_relations_topicsAttributes } from '@/interface/international_relations_topics.interface';
import { useDispatch } from 'react-redux';
import { setSelectCountry, setSelectToppic } from '@/redux/actions/toppicMenuActions';
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
   text {
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

//#endregion

//#region -> SidebarLayoutComponents

type useSelectorAuth = {
    profile: any;
    topics: international_relations_topicsAttributes[];
}
const SidebarLayoutComponents = () => {
    const dispatch = useDispatch();
    const { country_group } = useSelector(({ country }) => country);
    const { profile, topics }: useSelectorAuth = useSelector(({ auth }) => auth);
    const { country } = useSelector(({ toppic_menu }) => toppic_menu);
    const [collapsed, setCollapsed] = useState(false);

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
                                                <ColMenuFlag span={14} style={{ paddingTop: 5 }}><text>{e.initials_th}</text></ColMenuFlag>
                                            </Row>
                                        </MenuFlag>
                                    ))}
                                </ColText>
                                <ColText span={8}>
                                    {findCountryGroup("อาเซียน+9")?.countries.map((e: any) => (
                                        <MenuFlag key={e.id} id={e.id} className={e.id == country ? 'active' : ""} onClick={() => onClick(e.id)}>
                                            <Row>
                                                <ColMenuFlag span={8}><Flag width={40} src={e.icon_path} /></ColMenuFlag>
                                                <ColMenuFlag span={14} style={{ paddingTop: 5 }}><text>{e.initials_th}</text></ColMenuFlag>
                                            </Row>
                                        </MenuFlag>
                                    ))}
                                </ColText>
                                <ColText span={8}>
                                    {findCountryGroup("อื่นๆ")?.countries.map((e: any, index: number) => (
                                        <MenuFlag key={e.id} id={e.id} style={{ paddingBottom: 0 }} className={e.id == country ? 'active' : ""} onClick={() => onClick(e.id)}>
                                            <Row>
                                                <ColMenuFlag span={8}><Flag width={40} src={e.icon_path} /></ColMenuFlag>
                                                <ColMenuFlag span={14} style={{ paddingTop: 5 }}><text>{e.initials_th}</text></ColMenuFlag>
                                            </Row>
                                        </MenuFlag>
                                    ))}
                                </ColText>

                            </Row>

                            <IonsWorkingGroups countries={findCountryGroup("IONS Working Groups")?.countries} />

                            <H1 style={{ paddingTop: 20 }}>หัวข้อความสัมพันธ์ระหว่างประเทศ</H1>
                            {country ? <ToppicMenu list={topics} /> : <p style={{ textAlign: "center", color: "#fff" }}>- กรุณาเลือกประเทศ -</p>}


                        </>
                    </div>
                </div>
            </Sidebar>
        </>
    )
}
//#endregion

//#region -> IonsWorkingGroups
const IonsWorkingGroups = ({ countries }: { countries: any[] }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [memberฉountries, setMemberฉountries] = useState<any[]>([]);
    const [observerฉountries, setObserverฉountries] = useState<any[]>([]);
    const { country } = useSelector(({ toppic_menu }) => toppic_menu);

    useEffect(() => {
        if (countries) {
            // 1 คือ สมาชิก 2 คือ ผู้สังเกตการณ์
            setMemberฉountries(countries.filter(w => w.status === 1))
            setObserverฉountries(countries.filter(w => w.status === 2))
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
    const { toppic } = useSelector(({ toppic_menu }) => toppic_menu);

    const onChange = (value: any) => {
        console.log('value :>> ', value);
    }
    const onClick = (id: string) => {
        // console.log('id :>> ', id);
        dispatch(setSelectToppic(id))
    }
    return (
        <>
            <CollapseToppic ghost expandIconPosition={"end"} onChange={onChange}>
                {list.map((e, i) => {
                    const is_last_node = e.children.filter(w => w.last_node == true);
                    return (

                        (is_last_node.length == 0) ?
                            <PanelToppic header={`${index ? `${index}.` : ""}${i + 1}. ${e.name}`} key={e.id}>
                                <ToppicMenu list={e.children} index={`${index ? `${index}.` : ""}${i + 1}`} />
                            </PanelToppic>
                            :
                            <PanelToppic header={`${index ? `${index}.` : ""}${i + 1}. ${e.name}`} key={e.id}>
                                {is_last_node.map((_e, _i) => (
                                    <div className={`toppic ${_e.id == toppic ? 'active' : ""}`} onClick={() => onClick(_e.id)}>{`${index ? `${index}.` : ""}${i + 1}.${_i + 1} ${_e.name}`}</div>
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