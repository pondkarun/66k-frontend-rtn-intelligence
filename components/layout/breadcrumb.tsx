import { Breadcrumb } from 'antd'
import styled from "styled-components";
import { MdContentPaste, MdOutlineSearch } from "react-icons/md";
import { HiPlus } from "react-icons/hi";

const BreadcrumbNav = styled(Breadcrumb)`
    padding: 15px 20px;
    background: #fff;
    margin-bottom: 17px;
`
const BreadcrumbManage = styled.div`
    position: absolute;
    top: 73px;
    right: 16px;
    width: 123px;
    height: 41px;

    background: #FFFFFF;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
`
const LayoutButton = styled.div`
    position: relative;
    left: 12px;
    top: 6px;
`

const BreadcrumbButton = styled.button<{ color?: string, background?: string, disabled?: boolean }>`
    width: 30px;
    height: 30px;
    color: ${props => props.color || "#000"};
    background-color: ${props => props.background || "#fff"};
    border-radius: 5px;
    margin-right: 5px;
    cursor: pointer;
    svg {
        position: relative !important;
        top: 2px !important;
        right: 3px !important;
    }
    &:disabled {
        color: rgba(0, 0, 0, 0.25);
        background-color: rgba(0, 0, 0, 0.04);
        cursor: not-allowed;
        box-shadow: none;
    }
`

const addData = () => {
    console.log('addData')
}
const detailData = () => {
    console.log('detailData')
}
const searchData = () => {
    console.log('searchData')
}

const BreadcrumbLayoutComponents = () => {
    return (
        <div>
            <BreadcrumbNav separator=">">
                <span style={{ paddingRight: 5 }}>เลือกหัวข้อ : </span>
                <BreadcrumbNav.Item>ความสัมพันธ์ระหว่างรัฐบาล</BreadcrumbNav.Item>
                <BreadcrumbNav.Item>การเยี่ยมเยือนผู้บังคับบัญชา</BreadcrumbNav.Item>
                <BreadcrumbNav.Item>การไปเยือน</BreadcrumbNav.Item>
            </BreadcrumbNav>
            <BreadcrumbManage>
                <LayoutButton>
                    <BreadcrumbButton color="#fff" background='#0066FF' onClick={detailData}><MdContentPaste /></BreadcrumbButton>
                    <BreadcrumbButton color='#000' background='#FFC12B' onClick={searchData}><MdOutlineSearch /></BreadcrumbButton>
                    <BreadcrumbButton color='#fff' background='#00963F' disabled onClick={addData}><HiPlus /></BreadcrumbButton>
                </LayoutButton>
            </BreadcrumbManage>
        </div>
    )
}

export default BreadcrumbLayoutComponents