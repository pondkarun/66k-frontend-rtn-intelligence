import { Button, Layout, Row } from 'antd'
import styled from 'styled-components'
import { FiLogOut } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { logout } from '@/redux/actions/authActions'
import { setLoaging } from '@/redux/actions/configActions'
import { getByIDInternationalRelationsTopicsService } from '@/services/internationalRelationsTopics'
import { international_relations_topicsAttributes } from '@/interface/international_relations_topics.interface'
import { getByIdCountriesAllService } from '@/services/countries'
import { setObjCountry, setObjToppic } from '@/redux/actions/toppicMenuActions'
import { setCollapsed } from '@/redux/actions/commonAction'

//#region -> styled
const Navbar = styled(Layout.Header)`
  background-image: url('/images/page/layout/header.png');
  width: 100%;
  background-position: left;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 0 1.8rem;
`

const NavRow = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
`
const Content = styled.div`
  display: flex;
  justify-content: space-around;
  column-gap: 1rem;
  align-items: center;
`
const Logout = styled('div')`
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
const Flag = styled('div')`
  font-size: 35px;
  color: #fff;
  width: 100%;
  .ellipsis-text {
    white-space: nowrap; /* ไม่ให้ข้อความขึ้นบรรทัดใหม่ */
    overflow: hidden; /* ซ่อนข้อความที่เกินขอบเขต */
    text-overflow: ellipsis; /* แสดง "..." เมื่อข้อความเกิน */
    max-width: 600px; /* กำหนดความยาวสูงสุดของข้อความที่จะแสดง */
  }

  @media only screen and (max-width: 850px) {
    span {
      display: block;
      font-size: 24px;
      transition: all;
    }
  }

  @media only screen and (max-width: 440px) {
    span {
      display: none;
    }
  }
`

//#endregion

const NavbarcrumbLayoutComponents = () => {
  const { countries } = useSelector(({ country }) => country)
  const { country, toppic } = useSelector(({ toppic_menu }) => toppic_menu)
  const { collapsed } = useSelector((state: any) => state.common)
  const [dataCountry, setDataCountry] = useState<any>(null)
  const [dataToppic, setDataToppic] = useState<
    international_relations_topicsAttributes['data'] | undefined
  >(undefined)
  const dispatch = useDispatch()
  useEffect(() => {
    if (country) {
      const data_country = countries.find((w: any) => w.id == country)
      if (!data_country) {
        getByIdCountriesAllService(country)
          .then(({ data }) => {
            setDataCountry(data.data)
            dispatch(setObjCountry(data.data))
          })
          .catch((error) => {})
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
      const { data } = await getByIDInternationalRelationsTopicsService(id)
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
        <Content>
          <Button
            type='text'
            icon={
              collapsed ? (
                <MenuUnfoldOutlined style={{ color: '#fff' }} />
              ) : (
                <MenuFoldOutlined style={{ color: '#fff' }} />
              )
            }
            onClick={() => {
              dispatch(setCollapsed(!collapsed))
            }}
            style={{
              fontSize: '16px',
            }}
          />
          <Flag>
            {dataCountry ? (
              <div
                style={{
                  display: 'flex',
                  columnGap: '1rem',
                  alignItems: 'center',
                }}
              >
                <img
                  src={dataCountry.icon_path}
                  width={60}
                  height={60}
                  alt='country-img'
                />
                <span className='ellipsis-text'>
                  {dataCountry.initials_th}{' '}
                  {`${dataToppic ? ` - ${dataToppic.name}` : ''}`}
                </span>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  columnGap: '1rem',
                  alignItems: 'center',
                }}
              >
                <img
                  src={'/images/Royal_Thai_Navy.svg'}
                  alt='country-img'
                  width={55}
                  height={55}
                />
                <span className='ellipsis-text'>
                  ระบบข้อมูลความสัมพันธ์ระหว่างประเทศ
                </span>
              </div>
            )}
          </Flag>
        </Content>
        <Logout onClick={logout} style={{ paddingRight: 20}}>
          <span style={{ paddingRight: 5 }}>ออกจากระบบ</span>
          <FiLogOut />
        </Logout>
      </NavRow>
    </Navbar>
  )
}

export default NavbarcrumbLayoutComponents
