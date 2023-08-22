import { useEffect, useState } from 'react'
import Layout from '@/components/layout'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setBackground } from '@/redux/actions/configActions'
import { setSelectCountry } from '@/redux/actions/toppicMenuActions'
import { getAllCountryInternationalDataRelationsTopicsServices } from '@/services/internationalRelationsDatas'
import { Button, Col, Form, Input, Row, Table } from 'antd'
import styled from 'styled-components'
import { TallFieldInternationalRelationsdatas } from '@/interface/international_relations_datas.interface'
import type { ColumnsType } from 'antd/es/table'

type QueryProps = {
  search: string
}

const InternationalRelationsTopics = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const query = router.query as { country?: string }

  const [dataSource, setDataSource] =
    useState<TallFieldInternationalRelationsdatas['data'][]>()

  const [form] = Form.useForm<QueryProps>()

  const [search, setSearch] = useState<string>('')

  const randerQueryApi = async () => {
    if (query.country) {
      const data = await getAllCountryInternationalDataRelationsTopicsServices(
        query.country,
        search,
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
  }, [query.country])

  useEffect(() => {
    randerQueryApi()
  }, [search])

  const columns: ColumnsType<TallFieldInternationalRelationsdatas['data']> = [
    {
      key: 'event_name',
      title: 'หัวข้อ',
      render: (_value, record) => {
        return <span style={{ color: '00408e' }}>{record.ir_topic.name}</span>
      },
    },
    {
      key: 'event_name',
      title: 'ห้วงเวลา',
      render: (_value, record) => {
        const start_date = new Date(record.event_date_start).toLocaleDateString(
          'th-TH',
          {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
          },
        )
        const start_end = new Date(record.event_date_end).toLocaleDateString(
          'th-TH',
          {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
          },
        )

        return `${start_date} - ${start_end}`
      },
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

  const onFinish = () => {
    const data = form.getFieldsValue()
    setSearch(data.search ? `?search=${data.search}` : '')
  }

  return (
    <Layout>
      <>
        <Title>ค้นหาข้อมูล</Title>
        <ContentCount>พบข้อมูล: {dataSource?.length ?? 0} รายการ</ContentCount>
        <Row style={{ paddingTop: 10 }}>
          <Col span={6}>
            <Form
              form={form}
              layout='vertical'
              autoComplete='off'
              onFinish={onFinish}
            >
              <Form.Item name='search'>
                <Input
                  placeholder='ค้นหา'
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      form.submit()
                    }
                  }}
                  allowClear
                />
              </Form.Item>
            </Form>
          </Col>
          <Col span={6}>
            <Form.Item>
              <BtnMain onClick={() => form.submit()}>ค้นหา</BtnMain>
              <BtnMain onClick={() => {}}>Export</BtnMain>
              <BtnMain bgColor='#15bf3a' onClick={() => {}}>
                Excel
              </BtnMain>
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
const BtnMain = styled(Button)<{ bgColor?: string }>`
  height: 38px;
  margin-left: 10px;
  width: 100px;
  background-color: ${(poprs) => (poprs.bgColor ? poprs.bgColor : '#00408e')};
  color: #fff;
`
