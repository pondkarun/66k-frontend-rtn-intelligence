import { useCallback, useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  message,
} from 'antd'
import styled from 'styled-components'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { BsImage } from 'react-icons/bs'
import { HiOutlineDocumentText } from 'react-icons/hi'
import dayjs from 'dayjs'
import Layout from '@/components/layout'
import { setBackground } from '@/redux/actions/configActions'
import {
  setDefaultSearch,
  setSelectCountry,
} from '@/redux/actions/toppicMenuActions'
import {
  editInternationalDatasService,
  getAllCountryInternationalDataRelationsTopicsServices,
  getByInternationalDatasService,
  removeByInternationalDatasService,
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

enum EmodeOption {
  VIEW = 'view',
  EDIT = 'edit',
}

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

  const [specifics, setSpecifics] =
    useState<TallFieldInternationalRelationsdatas['data']['specific_field']>()

  const [search, setSearch] = useState<string>('')
  const [mode, setMode] = useState<EmodeOption>()
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

  const handleRecordManage = async (
    _record: TfieldInternationdata,
    _mode: EmodeOption,
  ) => {
    const response = await getByInternationalDatasService(_record.id)
    console.log('response.data', response.data)
    if (_mode === EmodeOption.EDIT) {
      setToppicId(response.data.ir_topic_id)
      setInternationalId(response.data.id)
    }
    setIsModalOpen(true)
    setMode(_mode)
    setSpecifics(response.data.specific_field)

    let model: any = {}
    let modal_reason: any = {}

    for (let i = 0; i < response.data.specific_field.length; i++) {
      const specific = response.data.specific_field[i]
      for (let index = 0; index < specific.sub_reason_name.length; index++) {
        const sub_reason = specific.sub_reason_name[index]
        console.log('sub_reason', sub_reason)

        model[specific.topic_reason_name] = sub_reason.name
      }
    }
    console.log('model', model)
    console.log('modal_reason', modal_reason)

    formInternational.setFieldsValue({
      ...response.data,
      toppic_name: _record.ir_topic.name,
      event_date: [
        dayjs(response.data.event_date_start),
        dayjs(response.data.event_date_end),
      ],
    } as any)
  }

  const handleRemoveRecordFormColumn = async (_record_id: string) => {
    try {
      await removeByInternationalDatasService(_record_id)
    } catch (error) {
      message.error('เกิดข้อผิดพลาดบางอย่าง')
      return
    } finally {
      message.success('ลบข้อมูลสพเร็จ')
      randerQueryApi()
    }
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
            <Tooltip title={`ดูข้อมูล`}>
              <EventContentField
                onClick={() => handleRecordManage(record, EmodeOption.VIEW)}
              >
                <EyeOutlined />
              </EventContentField>
            </Tooltip>
            <Tooltip title={`แก้ไขข้อมูล`}>
              <EventContentField
                onClick={() => handleRecordManage(record, EmodeOption.EDIT)}
              >
                <EditOutlined />
              </EventContentField>
            </Tooltip>
            <Tooltip title={`ลบข้อมูล`}>
              <Popconfirm
                placement='top'
                title={'ยืนยันการลบข้อมูล'}
                onConfirm={() => handleRemoveRecordFormColumn(record.id)}
                okText='ตกลง'
                cancelText='ยกเลิก'
              >
                <EventContentField>
                  <DeleteOutlined />
                </EventContentField>
              </Popconfirm>
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
    console.log('itemsForm', itemsForm)

    const modelRequest: Partial<TallFieldInternationalRelationsdatas['data']> =
      {
        country_id: menuSelector.country as unknown as string,
        ir_topic_id: toppicId,
        event_name: itemsForm.event_name,
        event_venue: itemsForm.event_venue,
      }
    // await editInternationalDatasService(modelRequest, internationalId)
    // formInternational.resetFields()
    // setIsModalOpen(!isModalOpen)
    // randerQueryApi()
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
            layout='vertical'
            onFinish={onFinishInternational}
            autoComplete='off'
          >
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item id='toppic_name' label='หัวข้อ' name='toppic_name'>
                  <Input disabled={mode === 'view' || mode === 'edit'} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  id='event_name'
                  label='ชื่อกิจกรรม'
                  name='event_name'
                  rules={[{ required: true }]}
                >
                  <Input disabled={mode === 'view' ? true : false} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  id='event_venue'
                  label='สถานที่จัดกิจกรรม'
                  name='event_venue'
                >
                  <Input disabled={mode === 'view' ? true : false} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  id='leader_name_thai'
                  label='หัวหน้าคณะฝ่ายไทย'
                  name='leader_name_thai'
                >
                  <Input disabled={mode === 'view'} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  id='leader_name_foreign'
                  label='หัวหน้าคณะฝ่ายต่างประเทศ'
                  name='leader_name_foreign'
                >
                  <Input disabled={mode === 'view'} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='event_date'
                  label='ห้วงเวลาเริ่มต้น - สิ้นสุด'
                  rules={[{ required: true }]}
                >
                  <DatePicker.RangePicker
                    disabled={mode === 'view'}
                    format={'DD/MM/YYYY'}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* <Form.List name='specific_field'>
              {(fields, { add, remove }) => {
                console.log('fields', fields)
                return (
                  <>
                    {fields.map(({ key, name, ...restField }) => {
                      console.log('restField', restField)
                      return <></>
                    })}
                  </>
                )
              }}
            </Form.List> */}

            {specifics?.map((specific, index) => {
              return (
                <div key={index}>
                  <SubTitle>{specific.topic_reason_name}</SubTitle>
                  <Line />
                  <Row gutter={[16, 0]}>
                    {specific.sub_reason_name.map((item, index) => {
                      return (
                        <Col span={12} key={index}>
                          <Form.Item
                            name={[
                              'specific_field',
                              specific.topic_reason_name,
                              item.name,
                              'value',
                            ]}
                            label={
                              <>
                                <span>{item.name}</span>
                                <Icon onClick={() => {}}>
                                  <Badge>
                                    <HiOutlineDocumentText />
                                  </Badge>
                                </Icon>
                                <Icon onClick={() => {}}>
                                  <Badge>
                                    <BsImage />
                                  </Badge>
                                </Icon>
                              </>
                            }
                          >
                            <Input disabled={mode === 'view'} />
                          </Form.Item>
                        </Col>
                      )
                    })}
                  </Row>
                </div>
              )
            })}
          </Form>
        </Modal>
      </>
    </Layout>
  )
}

export default InternationalRelationsTopics

const Title = styled.h1`
  color: #00408e;
  font-size: 24px;
  font-weight: revert;
  margin-bottom: 0em;
`

const SubTitle = styled.div`
  font-size: 1.75rem;
  color: #565252;
`
const Line = styled.div`
  height: 0px;
  border: 1px solid #d9d9d9;
  position: relative;
  margin: 2px 0px 10px 0px;
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
const Icon = styled.span`
  padding-left: 10px;
  cursor: pointer;
  .ant-badge-count {
    top: 17px;
    min-width: 15px;
    height: 15px;
    line-height: 15px;
  }
  svg {
    color: #00408e;
  }
`
