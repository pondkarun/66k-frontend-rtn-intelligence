import { Layout } from "antd";
import styled from "styled-components";
import { FiLogOut } from "react-icons/fi";

const Navbar = styled(Layout.Header)`
    background-image: url('/images/page/layout/header.png');
    width: 100%;
    background-position: left;
    background-repeat: no-repeat;
    background-size: cover;
`

const NavRow = styled("div")`
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
const FlagNameTh = styled("div")`
    position: relative;
    top: -78px;
    color: #fff;
    left: 80px;
    font-size: 18px;
`
const FlagNameEn = styled(FlagNameTh)`
    display: flex;
    top: -120px;
    font-size: 45px;
`
const FlagRecords = styled("div")`
    font-size: 20px;
    padding: 7px 0 0 25px;
`
const NavbarcrumbLayoutComponents = () => {

    const logout = () => {
        console.log('logout')
    }

    return (
        <Navbar>
            <NavRow>
                <Flag>
                    <img src="/images/flag_icon/001-ethiopia.png" />
                    <FlagNameTh>ประเทศเอธิโอเปีย</FlagNameTh>
                    <FlagNameEn>
                        <text>Ethiopia</text>
                        <FlagRecords>Found : 9,900 Records</FlagRecords>
                    </FlagNameEn>
                </Flag>
                <Logout onClick={logout}>
                    <text>ออกจากระบบ</text>
                    <FiLogOut />
                </Logout>
            </NavRow>
        </Navbar>
    )
}

export default NavbarcrumbLayoutComponents