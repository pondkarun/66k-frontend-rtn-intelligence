import { Layout, Row } from "antd";
import styled from "styled-components";
import { FiLogOut } from "react-icons/fi";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { logout } from "@/redux/actions/authActions";
import { setLoaging } from "@/redux/actions/configActions";
import { getByIDInternationalRelationsTopicsService } from "@/services/internationalRelationsTopics";
import { international_relations_topicsAttributes } from "@/interface/international_relations_topics.interface";
import { getByIdCountriesAllService } from "@/services/countries";
import { setObjCountry, setObjToppic } from "@/redux/actions/toppicMenuActions";

//#region -> styled
const Navbar = styled(Layout.Header)`
    background-image: url('/images/page/layout/header.png');
    width: 100%;
    background-position: left;
    background-repeat: no-repeat;
    background-size: cover;
`

const NavRow = styled(Row)`
    height: 100%;
    display: flex;
    justify-content: space-between;
`
const Logout = styled("div")`
    color: #fff;
    left: 30px;
    position: relative;
    cursor: pointer;
    text {
        padding-right: 10px;
    }
    svg {
        position: relative !important;
        top: 5px !important;
    }
`
const Flag = styled("div")`
    position: relative;
    left: -30px;
    top: -2px;
    img {
        width: 65px;
    }  
`
const FlagName = styled("div")`
    position: relative;
    top: -65px;
    color: #fff;
    left: 80px;
    font-size: 35px;
    width: fit-content;
    .ellipsis-text {
        white-space: nowrap; /* ไม่ให้ข้อความขึ้นบรรทัดใหม่ */
        overflow: hidden; /* ซ่อนข้อความที่เกินขอบเขต */
        text-overflow: ellipsis; /* แสดง "..." เมื่อข้อความเกิน */
        max-width: 150px; /* กำหนดความยาวสูงสุดของข้อความที่จะแสดง */
    }

    @media only screen and (max-width: 768px) {
        span {
            display: none;
        }
    }
    
`

//#endregion

const NavbarcrumbLayoutComponents = () => {
    const { countries } = useSelector(({ country }) => country);
    const { country, toppic } = useSelector(({ toppic_menu }) => toppic_menu);
    const [dataCountry, setDataCountry] = useState<any>(null)
    const [dataToppic, setDataToppic] = useState<international_relations_topicsAttributes['data'] | undefined>(undefined)
    const dispatch = useDispatch();
    useEffect(() => {
        if (country) {
            const data_country = countries.find((w: any) => w.id == country);
            if (!data_country) {
                getByIdCountriesAllService(country).then(({ data }) => {
                    setDataCountry(data.data)
                    dispatch(setObjCountry(data.data))
                }).catch(error => {
                    
                })
            } else {
                setDataCountry(data_country)
                dispatch(setObjCountry(data_country))
            }
        }

        if (toppic) {
            getToppicData(toppic)
        }
    }, [country, toppic])

    const getToppicData = async (id: string) => {
        try {
            dispatch(setLoaging(true))
            const { data } = await getByIDInternationalRelationsTopicsService(id);
            setDataToppic(data)
            dispatch(setObjToppic(data))
            dispatch(setLoaging(false))
        } catch (error) {
            dispatch(setLoaging(false))
        }
    }

    return (
        <Navbar>
            <NavRow>
                <Flag>
                    {dataCountry ? <img src={dataCountry.icon_path} /> : <img style={{ width: 27 }} src={"/images/Royal_Thai_Navy.svg"} />}
                    <FlagName> {dataCountry ?
                        <span className="ellipsis-text">{dataCountry.initials_th} {`${dataToppic ? ` - ${dataToppic.name}` : ""}`}</span> :
                        <span className="ellipsis-text">ระบบข้อมูลความสัมพันธ์ระหว่างประเทศ</span>}
                    </FlagName>
                </Flag>
                <Logout onClick={logout}>
                    <span style={{ paddingRight: 5 }}>ออกจากระบบ</span>
                    <FiLogOut />
                </Logout>
            </NavRow>
        </Navbar>
    )
}

export default NavbarcrumbLayoutComponents