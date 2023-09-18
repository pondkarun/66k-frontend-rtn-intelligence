import { Breadcrumb } from 'antd'
import styled from 'styled-components'
import { MdContentPaste, MdOutlineSearch } from 'react-icons/md'
import { HiPlus } from 'react-icons/hi'
import { useSelector, useDispatch } from 'react-redux'
import {
  setObjToppic,
  setSelectToppic,
} from '@/redux/actions/toppicMenuActions'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'

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

  background: #ffffff;
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
`
const LayoutButton = styled.div`
  position: relative;
  left: 12px;
  top: 6px;
`

const Logout = styled("div")`
    color: #000;
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

const BreadcrumbButton = styled.button<{
  color?: string
  background?: string
  disabled?: boolean
}>`
  width: 30px;
  height: 30px;
  color: ${(props) => props.color || '#000'};
  background-color: ${(props) => props.background || '#fff'};
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
  const dispatch = useDispatch()
  const state = useSelector((state: any) => state.toppic_menu)
  const router = useRouter()
  const pathname = usePathname()

  const BreadcrumbView = () => {
    switch (pathname) {
      case "/system/identity_users":
        return (
          <BreadcrumbNav separator='>'>
            <span style={{ paddingRight: 5 }}>จัดการระบบ : </span>
            <BreadcrumbNav.Item href='/system/identity_users'>ผู้ใช้งาน</BreadcrumbNav.Item>
          </BreadcrumbNav>
        )
      case "/system/international_relations_topics":
        return (
          <BreadcrumbNav separator='>'>
            <span style={{ paddingRight: 5 }}>จัดการระบบ : </span>
            <BreadcrumbNav.Item href='/system/international_relations_topics'>หัวข้อความสัมพันธ์ระหว่างประเทศ</BreadcrumbNav.Item>
          </BreadcrumbNav>
        )
      case "/system/departments":
        return (
          <BreadcrumbNav separator='>'>
            <span style={{ paddingRight: 5 }}>จัดการระบบ : </span>
            <BreadcrumbNav.Item href='/system/departments'>หน่วยงาน</BreadcrumbNav.Item>
          </BreadcrumbNav>
        )
      default:
        return (
          <>
            <BreadcrumbNav separator='>'>
              <span style={{ paddingRight: 5 }}>เลือกหัวข้อ : </span>
              <BreadcrumbNav.Item href='/'>หน้าหลัก</BreadcrumbNav.Item>
              {!state.country ? (
                <span>เลือกประเทศ</span>
              ) : (
                <>
                  <BreadcrumbNav.Item
                    href={`/international-relations-topics/${state.country}`}
                    onClick={() => {
                      dispatch(setSelectToppic(undefined))
                      dispatch(setObjToppic(undefined))
                    }}
                  >
                    {state.country_obj?.initials_th}
                  </BreadcrumbNav.Item>
                  {!state.toppic && router.pathname !== '/' ? (
                    <span>ค้นหาข้อมูล</span>
                  ) : null}
                </>
              )}
              {state.toppic && (
                <>
                  <BreadcrumbNav.Item
                    href={`/international-relations-topics/${state.country}/${state.toppic}`}
                  >
                    {state.toppic_obj?.name}
                  </BreadcrumbNav.Item>
                </>
              )}
            </BreadcrumbNav>

          </>
        )
        break;
    }
  }

  return (
    <>
      {BreadcrumbView()}
    </>
  )
}

export default BreadcrumbLayoutComponents
