import { useEffect, useState } from 'react'
import Layout from '@/components/layout'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setBackground } from '@/redux/actions/configActions'
import { setSelectCountry } from '@/redux/actions/toppicMenuActions'
import { getAllCountryInternationalDataRelationsTopicsServices } from '@/services/internationalRelationsDatas'
import { Button, Col, ConfigProvider, Form, Input, Row, Table } from 'antd'
import styled, { css } from 'styled-components'
import {
  TallFieldInternationalRelationsdatas,
  Tforminternational,
} from '@/interface/international_relations_datas.interface'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { PlusCircleOutlined } from '@ant-design/icons'

const InternationalRelationsTopics = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const query = router.query as { country?: string }

  const [dataSource, setDataSource] =
    useState<TallFieldInternationalRelationsdatas['data'][]>()

  const randerQueryApi = async () => {
    if (query.country) {
      const data = await getAllCountryInternationalDataRelationsTopicsServices(
        query.country,
      )
      const datatype =
        data.data as unknown as TallFieldInternationalRelationsdatas['data'][]
      setDataSource(datatype)
    }
  }

  useEffect(() => {
    if (query.country) {
      dispatch(setSelectCountry(query.country))
      dispatch(setBackground('#fff'))
    }
    randerQueryApi()
  }, [query.country])

  const columns: ColumnsType<TallFieldInternationalRelationsdatas['data']> = [
    {
      key: 'event_name',
      title: 'หัวข้อ',
      dataIndex: 'event_name',
      className: 'ant-head-th',
      render: (value) => value,
    },
    {
      key: 'event_name',
      title: 'ห้วงเวลา',
      render: (_value, record) => (
        <>{`${record.event_date_start}-${record.event_date_end}`}</>
      ),
    },
    {
      key: 'event_name',
      title: 'ชื่อกิจกรรม',
      dataIndex: 'event_name',
      render: (value) => value,
    },
    {
      key: 'event_venue',
      title: 'สถานที่จัดกิจจกรรม',
      dataIndex: 'event_venue',
      render: (value) => value,
    },
    {
      key: 'event_name',
      title: 'ไฟล์แนบ',
      dataIndex: 'event_name',
      render: (value) => value,
    },
    {
      key: 'event_name',
      title: 'จัดการ',
      dataIndex: 'event_name',
      render: (value) => value,
    },
  ]

  return (
    <Layout>
      <>
        <Title>ค้นหาข้อมูล</Title>
        <ContentCount>พบข้อมูล: {dataSource?.length ?? 0} รายการ</ContentCount>
        <Row style={{ paddingTop: 10 }}>
          <Col span={6}>
            <Form
              // form={formSearch}
              name='search_identity_users'
              layout='vertical'
              autoComplete='off'
              // onFinish={onFinishSearch}
            >
              <Form.Item name='search'>
                <Input
                  placeholder='ค้นหา'
                  // onKeyPress={(event) => {
                  //   if (event.key === 'Enter') {
                  //     formSearch.submit()
                  //   }
                  // }}
                  allowClear
                />
              </Form.Item>
            </Form>
          </Col>
          <Col span={6}>
            <Form.Item>
              <ButtonSearch onClick={() => {}}>ค้นหา</ButtonSearch>
              <ButtonSearch onClick={() => {}}>
                <PlusCircleOutlined /> เพิ่ม
              </ButtonSearch>
            </Form.Item>
          </Col>
        </Row>
        <Table
          style={{ borderRadius: ' 16px 16px 0 0' }}
          rowKey={'id'}
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: '100%', y: '100%' }}
        />
      </>
    </Layout>
  )
}

export default InternationalRelationsTopics

const Title = styled.h1`
  color: #00408e;
  font-size: 36px;
  font-weight: revert;
  margin-bottom: 0em;
`
const ContentCount = styled.span`
  font-size: 26px;
`
const ButtonSearch = styled(Button)`
  height: 38px;
  margin-left: 10px;
  width: 100px;
  background-color: #00408e;
  color: #fff;
`
