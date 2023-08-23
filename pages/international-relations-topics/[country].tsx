import { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Table, Tooltip } from 'antd'
import styled from 'styled-components'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Layout from '@/components/layout'
import { setBackground } from '@/redux/actions/configActions'
import { setSelectCountry } from '@/redux/actions/toppicMenuActions'
import {
  editInternationalDatasService,
  getAllCountryInternationalDataRelationsTopicsServices,
  getByInternationalDatasService,
} from '@/services/internationalRelationsDatas'
import {
  TallFieldInternationalRelationsdatas,
  Tforminternational,
} from '@/interface/international_relations_datas.interface'
import DocumentIcon from '@/components/svg/DocumentIcon'
import ImageBackgroundIcon from '@/components/svg/ImageBackgroundIcon'
import { KeyTypestateRedux } from '@/redux/reducers/rootReducer'
import { MenuT } from '@/redux/reducers/toppicMenuReducer'
import type { ColumnsType } from 'antd/es/table'

type QueryProps = {
  search?: string
}

const InternationalRelationsTopics = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const path = router.query as { country?: string }

  const menuSelector = useSelector<KeyTypestateRedux>(
    ({ toppic_menu }) => toppic_menu,
  ) as MenuT

  const [form] = Form.useForm<QueryProps>()
  const [formInternational] = Form.useForm<Tforminternational>()

  const [search, setSearch] = useState<string>('')
  const [mode, setMode] = useState<'view' | 'edit' | ''>('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [dataSource, setDataSource] =
    useState<TallFieldInternationalRelationsdatas['data'][]>()

  const randerQueryApi = async () => {
    if (menuSelector.country) {
      const data = await getAllCountryInternationalDataRelationsTopicsServices({
        country_id: menuSelector.country,
        search: search,
      })
      const datatype =
        data.data as unknown as TallFieldInternationalRelationsdatas['data'][]
      setDataSource(datatype)
    }
  }

  useEffect(() => {
    if (path.country) {
      dispatch(setSelectCountry(path.country))
      dispatch(setBackground('#fff'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path.country])

  useEffect(() => {
    randerQueryApi()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, menuSelector.country])

  const columns: ColumnsType<TallFieldInternationalRelationsdatas['data']> = [
    {
      key: 'event_name',
      title: 'หัวข้อ',
      render: (_value, record) => {
        return <span style={{ color: '#00408e' }}>{record.ir_topic.name}</span>
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
      render: (_value, recoard) => {
        return (
          <FileTableContentField>
            <Tooltip>
              <EventContentField>
                <DocumentIcon />
              </EventContentField>
            </Tooltip>
            <Tooltip>
              <EventContentField>
                <ImageBackgroundIcon />
              </EventContentField>
            </Tooltip>
          </FileTableContentField>
        )
      },
    },
    {
      key: 'event_name',
      title: 'จัดการ',
      dataIndex: 'event_name',
      render: (_value, recoard) => {
        return (
          <FileTableContentField>
            <Tooltip>
              <EventContentField
                onClick={async () => {
                  setIsModalOpen(true)
                  setMode('view')
                  const response = await getByInternationalDatasService(
                    recoard.id,
                  )
                  formInternational.setFieldsValue({
                    ...response.data,
                    toppic_name: recoard.ir_topic.name,
                  } as any)
                }}
              >
                <EyeOutlined />
              </EventContentField>
            </Tooltip>
            <Tooltip>
              <EventContentField
                onClick={async () => {
                  setIsModalOpen(true)
                  setMode('edit')
                  const response = await getByInternationalDatasService(
                    recoard.id,
                  )
                  formInternational.setFieldsValue({
                    ...response.data,
                    toppic_name: recoard.ir_topic.name,
                    field_id: recoard.ir_topic.id,
                  } as any)
                  const _data = formInternational.getFieldsValue()
                  console.log('_data', _data)
                }}
              >
                <EditOutlined />
              </EventContentField>
            </Tooltip>
          </FileTableContentField>
        )
      },
    },
  ]

  const onFinish = () => {
    const data = form.getFieldsValue()
    setSearch(data.search ? `?search=${data.search}` : '')
  }

  const onFinishInternational = async () => {
    const _data = formInternational.getFieldsValue()
    console.log('_data', _data)
    delete _data.toppic_name
    await editInternationalDatasService(
      {
        country_id: menuSelector.country as never,
        ir_topic_id: _data.field_id,
        event_name: _data.event_name,
        event_venue: _data.event_venue as string,
      },
      _data.field_id,
    )
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
                  // defaultValue={query?.search}
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
          <Col span={8}>
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

        <Modal
          title={`${mode == 'edit' ? 'แก้ไข' : 'ดู'}หัวข้อความสัมพันธ์`}
          open={isModalOpen}
          onOk={() => formInternational.submit()}
          onCancel={() => setIsModalOpen(!isModalOpen)}
          width={600}
        >
          <Form
            form={formInternational}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinishInternational}
            autoComplete='off'
          >
            <Form.Item label='หัวข้อ' name='toppic_name'>
              <Input
                disabled={mode === 'view' || mode === 'edit' ? true : false}
              />
            </Form.Item>

            <Form.Item label='ชื่อกิจกรรม' name='event_name'>
              <Input disabled={mode === 'view' ? true : false} />
            </Form.Item>

            <Form.Item label='สถานที่จัดกิจกรรม' name='event_venue'>
              <Input disabled={mode === 'view' ? true : false} />
            </Form.Item>
          </Form>
        </Modal>
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
const FileTableContentField = styled.div`
  display: flex;
  justify-content: center;
  column-gap: 0.5rem;
`
const EventContentField = styled.a`
  :hover {
    cursor: pointer;
  }
`
