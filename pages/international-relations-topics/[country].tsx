import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Space, Table, Tooltip } from 'antd'
import styled from 'styled-components'
import { EditOutlined, EyeOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Layout from '@/components/layout'
import { setBackground } from '@/redux/actions/configActions'
import {
  setDefaultSearch,
  setSelectCountry,
} from '@/redux/actions/toppicMenuActions'
import {
  editInternationalDatasService,
  getAllCountryInternationalDataRelationsTopicsServices,
} from '@/services/internationalRelationsDatas'
import {
  TallFieldInternationalRelationsdatas,
  TfieldInternationdata,
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
  const [formInternational] =
    Form.useForm<TallFieldInternationalRelationsdatas['data']>()

  const [search, setSearch] = useState<string>('')
  const [mode, setMode] = useState<'view' | 'edit' | ''>('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [toppicId, setToppicId] = useState('')
  const [internationalId, setInternationalId] = useState('')

  const [dataSource, setDataSource] =
    useState<TallFieldInternationalRelationsdatas['data'][]>()

  const randerQueryApi = useCallback(async () => {
    if (menuSelector.country) {
      const data = await getAllCountryInternationalDataRelationsTopicsServices({
        country_id: menuSelector.country,
        search: search ? search : `?search=${menuSelector.search}`,
      })
      const datatype =
        data.data as unknown as TallFieldInternationalRelationsdatas['data'][]
      setDataSource(datatype)
    }
  }, [menuSelector.country, search, menuSelector.search])

  useEffect(() => {
    if (path.country) {
      dispatch(setSelectCountry(path.country as string))
      dispatch(setBackground('#fff'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path.country])

  useEffect(() => {
    randerQueryApi()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, menuSelector.country])

  const handleEditRecord = (_record: TfieldInternationdata) => {
    setIsModalOpen(true)
    setMode('edit')
    setToppicId(_record.ir_topic_id)
    setInternationalId(_record.id)
    formInternational.setFieldsValue({
      ..._record,
      toppic_name: _record.ir_topic.name,
    } as any)
  }

  const columns: ColumnsType<TallFieldInternationalRelationsdatas['data']> = [
    {
      key: 'ir_topic',
      title: 'หัวข้อ',
      render: (_value, record) => {
        return <span style={{ color: '#00408e' }}>{record.ir_topic.name}</span>
      },
    },
    {
      key: 'event_date',
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
      key: 'file-record',
      title: 'ไฟล์แนบ',
      render: (_value, record) => {
        return (
          <FileTableContentField>
            {record.file_documents.length > 0 && (
              <Tooltip>
                <EventContentField>
                  <DocumentIcon />
                </EventContentField>
              </Tooltip>
            )}
            {record.image_documents.length > 0 && (
              <Tooltip>
                <EventContentField>
                  <ImageBackgroundIcon />
                </EventContentField>
              </Tooltip>
            )}
            {record.file_documents.length > 0 &&
              record.image_documents.length > 0 && (
                <>
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
                </>
              )}
            {record.file_documents.length === 0 &&
              record.image_documents.length === 0 && <></>}
          </FileTableContentField>
        )
      },
    },
    {
      key: 'maneage',
      title: 'จัดการ',
      render: (_value, record) => {
        return (
          <FileTableContentField>
            <Tooltip>
              <EventContentField
                onClick={async () => {
                  setIsModalOpen(true)
                  setMode('view')
                  console.log('record', record)
                  formInternational.setFieldsValue({
                    ...record,
                    toppic_name: record.ir_topic.name,
                    specific_field: record.specific_field?.reason
                  } as any)
                }}
              >
                <EyeOutlined />
              </EventContentField>
            </Tooltip>
            <Tooltip>
              <EventContentField onClick={() => handleEditRecord(record)}>
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
    dispatch(setDefaultSearch(''))
    setSearch(data.search ? `?search=${data.search}` : '')
  }

  const onFinishInternational = async () => {
    const itemsForm = formInternational.getFieldsValue()

    const modelRequest: Partial<TallFieldInternationalRelationsdatas['data']> =
      {
        country_id: menuSelector.country as unknown as string,
        ir_topic_id: toppicId,
        event_name: itemsForm.event_name,
        event_venue: itemsForm.event_venue,
      }
    await editInternationalDatasService(modelRequest, internationalId)
    formInternational.resetFields()
    setIsModalOpen(!isModalOpen)
    randerQueryApi()
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
            <Form.Item id='toppic_name' label='หัวข้อ' name='toppic_name'>
              <Input
                disabled={mode === 'view' || mode === 'edit' ? true : false}
              />
            </Form.Item>
            <Form.Item id='event_name' label='ชื่อกิจกรรม' name='event_name'>
              <Input disabled={mode === 'view' ? true : false} />
            </Form.Item>
            <Form.Item
              id='event_venue'
              label='สถานที่จัดกิจกรรม'
              name='event_venue'
            >
              <Input disabled={mode === 'view' ? true : false} />
            </Form.Item>
            <Form.List name='specific_field'>
              {(fields, { add, remove }) => (
                <div style={{ paddingTop: 25, paddingLeft: 80 }}>
                  {fields.map((field) => (
                    <Space key={field.key} align='baseline'>
                      <Form.Item
                        // noStyle
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.groups !== curValues.groups ||
                          prevValues.value !== curValues.value
                        }
                      >
                        {() => (
                          <Form.Item
                            {...field}
                            label='Groups'
                            name={[field.name, 'groups']}
                            rules={[
                              {
                                required: true,
                                message: 'Missing groups name',
                              },
                            ]}
                          >
                            <Input
                              style={{ width: 180 }}
                              disabled={mode == 'view' ? true : false}
                            />
                          </Form.Item>
                        )}
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'value']}
                        rules={[{ required: true, message: 'Missing value' }]}
                      >
                        <Select
                          mode='tags'
                          style={{ width: 240 }}
                          options={[]}
                          disabled={mode == 'view' ? true : false}
                        />
                      </Form.Item>

                      {mode !== 'view' ? (
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                    </Space>
                  ))}
                  {mode !== 'view' ? (
                    <Form.Item>
                      <Button
                        type='dashed'
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        เพิ่ม
                      </Button>
                    </Form.Item>
                  ) : null}
                </div>
              )}
            </Form.List>
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
