import { Layout } from "antd";
import styled from "styled-components";
import { FiLogOut } from "react-icons/fi";
import { logout } from "@/redux/actions/authActions";
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";

//#region -> styled
const Navbar = styled(Layout.Header)`
    background-image: url('/images/page/layout/header.png');
    width: 100%;
    background-position: left;
    background-repeat: no-repeat;
    background-size: cover;
`

const NavRow = styled("div")`
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
    font-size: 40px;
`
const FlagRecords = styled("div")`
    font-size: 20px;
    padding: 7px 0 0 25px;
`
//#endregion

const NavbarcrumbLayoutComponents = () => {
    const { countries } = useSelector(({ country }) => country);
    const { country, toppic } = useSelector(({ toppic_menu }) => toppic_menu);
    const [dataCountry, setDataCountry] = useState<any>(null)

    useEffect(() => {
        if (country) {
            const data_country = countries.find((w: any) => w.id == country);
            setDataCountry(data_country)
        }
    }, [country, toppic])

    return (
        <Navbar>
            <NavRow>


                <Flag>
                    {dataCountry ? <img src={dataCountry.icon_path} /> : <img style={{ width: 27 }} src={"./images/Royal_Thai_Navy.svg"} />}
                    <FlagName> {dataCountry ?
                        <span>{dataCountry.initials_th}</span> :
                        <span>ระบบข้อมูลความสัมพันธ์ระหว่างประเทศ</span>}
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