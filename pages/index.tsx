import styled from 'styled-components'
import Layout from '../components/layout'
import { Button, Form, Input } from 'antd'
import { primary_color } from './_app'
import { SearchOutlined } from '@ant-design/icons'
import Router from 'next/router'
import { useSelector } from 'react-redux'
import { KeyTypestateRedux } from '@/redux/reducers/rootReducer'
import { MenuT } from '@/redux/reducers/toppicMenuReducer'

//#region -> styled
const LandingPage = styled('div')`
  height: 80vh;
  text-align: center;
  img {
    width: 100px;
    padding-top: 20vh;
  }
  h1 {
    color: #fff;
    font-size: 2rem;
  }
`

const FormSearch = styled(Form)`
  margin-top: 25px;
  justify-content: center;
  .ant-input-affix-wrapper {
    background-color: #ffffff00;
    color: ${primary_color};
    border-width: 0px;
    border-bottom: 1px solid ${primary_color};
    border-radius: 0px;

    .ant-input {
      background-color: #ffffff00;
      color: ${primary_color};
      padding-left: 15px;
    }
    .anticon.ant-input-password-icon {
      color: ${primary_color};
      cursor: pointer;
      transition: all 0.3s;
    }
    input::placeholder {
      color: ${primary_color};
    }
  }
  .ant-input-affix-wrapper-status-error {
    input::placeholder {
      color: #ff4d4f;
    }
  }
  @media only screen and (max-width: 640px) {
    margin-top: 0px !important;
  }
  @media only screen and (max-width: 550px) {
    padding: 40px 0px 0 0px;
  }
`

const ButtonSearch = styled(Button)`
  border: 1px solid ${primary_color};
  background-color: #e4b35400;
  font-size: 25px !important;
  color: ${primary_color};
  &:hover {
    color: #0b1741 !important;
  }

  @media only screen and (max-width: 550px) {
    font-size: 20px !important;
    height: 50px !important;
  }
`
//#endregion

const Home = () => {
  const menu = useSelector<KeyTypestateRedux>(
    ({ toppic_menu }) => toppic_menu,
  ) as MenuT

  const [form] = Form.useForm<{ search: string }>()

  const onFinish = (_value: unknown) => {
    console.log('value :>> ', _value)
    const value = _value as { search?: string }
    Router.push(`/international-relations-topics/${menu.country}`)
  }

  return (
    <Layout>
      <LandingPage>
        <img src='./images/Royal_Thai_Navy.svg' alt='Royal_Thai_Navy.svg' />
        <h1>ระบบข้อมูลความสัมพันธ์ระหว่างประเทศ</h1>

        {typeof menu.country !== 'undefined' && (
          <FormSearch
            form={form}
            name='login'
            layout={'inline'}
            style={{ marginTop: '25px' }}
            onFinish={onFinish}
            autoComplete='off'
          >
            <Form.Item name='search'>
              <Input
                size='large'
                placeholder='ค้นหาข้อมูล'
                prefix={<SearchOutlined />}
                style={{ width: 400 }}
              />
            </Form.Item>

            <Form.Item>
              <ButtonSearch size='large' type='primary' htmlType='submit'>
                ค้นหา
              </ButtonSearch>
            </Form.Item>
          </FormSearch>
        )}
      </LandingPage>
    </Layout>
  )
}

export default Home
