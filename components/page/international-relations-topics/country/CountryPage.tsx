import { Fragment, useCallback, useEffect, useState } from 'react'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Table,
  Tooltip,
  message,
} from 'antd'
import styled from 'styled-components'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
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
  TdocumentsOption,
  TfieldInternationdata,
  Tforminternational,
} from '@/interface/international_relations_datas.interface'
import DocumentIcon from '@/components/svg/DocumentIcon'
import ImageBackgroundIcon from '@/components/svg/ImageBackgroundIcon'
import { KeyTypestateRedux } from '@/redux/reducers/rootReducer'
import { MenuT } from '@/redux/reducers/toppicMenuReducer'
import { TMapReason } from '@/interface/international_relations_topics.interface'
import { getInternalFilePublicService } from '@/services/upload'
import FormUpload from '@/components/shares/FormUpload'
import ReactPDFDoc from '@/components/page/international-relations-topics/country/ReactPDFDoc'
import { ActionTprops } from '../country'
import FormUploadInput from './FormUploadInput'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import * as XLSX from 'xlsx'
import sheelConfig from './xlsx/sheelConfig'
import download from 'downloadjs'

enum EmodeOption {
  VIEW = 'view',
  EDIT = 'edit',
}

type QueryProps = {
  search?: string
}

interface InternationalRelationsTopicsProps {
  setActiontype: React.Dispatch<React.SetStateAction<ActionTprops>>
}

const InternationalRelationsTopics = (
  props: InternationalRelationsTopicsProps,
) => {
  const { setActiontype } = props
  const dispatch = useDispatch()
  const router = useRouter()

  const path = router.query as { country?: string; toppic?: string }

  const menuSelector = useSelector<KeyTypestateRedux>(
    ({ toppic_menu }) => toppic_menu,
  ) as MenuT

  const [form] = Form.useForm<QueryProps>()
  const [formInternational] = Form.useForm<Tforminternational>()

  const [specifics, setSpecifics] =
    useState<TallFieldInternationalRelationsdatas['data']['specific_field']>()

  const [search, setSearch] = useState<string>(
    menuSelector.search ? `?search=${menuSelector.search}` : '',
  )
  const [mode, setMode] = useState<EmodeOption>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isopenExport, setIsOpenExport] = useState(false)

  const [toppicId, setToppicId] = useState('')
  const [internationalId, setInternationalId] = useState('')
  const [renderFiles, setRenderFiles] = useState<{
    docs: TdocumentsOption
    img: TdocumentsOption
  }>()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

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
      dispatch(setSelectCountry(path.country as string))
      dispatch(setBackground('#fff'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path.country])

  useEffect(() => {
    randerQueryApi()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, menuSelector.country])

  const handleRecordManage = useCallback(
    async (_record: TfieldInternationdata, _mode: EmodeOption) => {
      let responseFiles: any
      try {
        responseFiles = await getInternalFilePublicService(
          _record.country_id,
          _record.ir_topic_id,
        )
      } catch (error) {
        /* empty */
      }
      const responseDatas: any = await getByInternationalDatasService(_record.id)

      if (_mode === EmodeOption.EDIT) {
        setToppicId(responseDatas.data.ir_topic_id)
        setInternationalId(responseDatas.data.id)
      }

      const mapDocs: TdocumentsOption = []
      const mapImage: TdocumentsOption = []

      if (typeof responseFiles !== 'undefined') {
        if (responseDatas.data.file_documents)
          for (let z = 0; z < responseDatas.data.file_documents.length; z++) {
            const fileDocument = responseDatas.data.file_documents[z]
            const docs = responseFiles.data.find((_url: string) => {
              const splitSlach = _url.split('/')
              const pathName = splitSlach[splitSlach.length - 1]
              return pathName === fileDocument.name
            })
            mapDocs.push({ ...fileDocument, url: docs as string })
          }

        if (responseDatas.data.image_documents)
          for (let z = 0; z < responseDatas.data.image_documents.length; z++) {
            const fileImage = responseDatas.data.image_documents[z]
            const img = responseFiles.data.find((_url: string) => {
              const splitSlach = _url.split('/')
              const pathName = splitSlach[splitSlach.length - 1]
              return pathName === fileImage.name
            })
            mapImage.push({ ...fileImage, url: img as string })
          }
      }

      const model_main: { [k: string]: unknown } = {}

      for (let i = 0; i < responseDatas.data.specific_field.length; i++) {
        const specific = responseDatas.data.specific_field[i]
        const modal_reason: { [k: string]: unknown } = {}

        for (let index = 0; index < specific.sub_reason_name.length; index++) {
          const sub_reason = specific.sub_reason_name[index];
          modal_reason[sub_reason.name] = {
            value: sub_reason.value,
          }
        }
        model_main[specific.topic_reason_name] = modal_reason
      }
      setIsModalOpen(true)
      setMode(_mode)
      setSpecifics(responseDatas.data.specific_field)
      setRenderFiles({
        docs: mapDocs,
        img: mapImage,
      })

      formInternational.setFieldsValue({
        ...responseDatas.data,
        toppic_name: _record.ir_topic.name,
        event_date: [
          dayjs(responseDatas.data.event_date_start),
          dayjs(responseDatas.data.event_date_end),
        ],
        specific_field: model_main,
        file_documents: mapDocs,
        image_documents: mapImage,
      } as any)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

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
      width: 200
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
      width: 200,
      align: "center"
    },
    {
      key: 'event_name',
      title: 'ชื่อกิจกรรม',
      dataIndex: 'event_name',
      render: (value) => value,
      width: 300,
    },
    {
      key: 'event_venue',
      title: 'สถานที่จัดกิจจกรรม',
      dataIndex: 'event_venue',
      render: (value) => value ?? "-",
      width: 200,
    },
    {
      key: 'file-record',
      title: 'ไฟล์แนบ',
      render: (_value, record: any) => {
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
      width: 100,
      align: "center"
    },
    {
      key: 'maneage',
      title: 'จัดการ',
      width: 100,
      align: "center",
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
    const itemsForm: any = formInternational.getFieldsValue()

    const createReason: TMapReason = []
    const createValuesReasonImage: TdocumentsOption = []
    const createValuesReasonFile: TdocumentsOption = []

    for (const [key1, values] of Object.entries(
      itemsForm.specific_field as unknown as never,
    )) {
      const subReason = []
      const fields = Object.entries(values as unknown as never)

      for (let index = 0; index < fields.length; index++) {
        const element = fields[index] as any
        subReason.push({
          name: element[0],
          value: element[1].value,
        })
      }

      createReason.push({
        topic_reason_name: key1,
        sub_reason_name: subReason,
      })
    }
    if (typeof itemsForm.file_documents !== 'undefined')
      if (itemsForm.file_documents.length > 0) {
        for (let x = 0; x < itemsForm.file_documents.length; x++) {
          const file_document = itemsForm.file_documents[x]
          createValuesReasonFile.push({
            url: file_document.url,
            name: file_document.name,
          })
        }
      }

    if (typeof itemsForm.image_documents !== 'undefined')
      if (itemsForm.image_documents.length > 0) {
        for (let z = 0; z < itemsForm.image_documents.length; z++) {
          const image_document = itemsForm.image_documents[z]
          createValuesReasonImage.push({
            url: image_document.url,
            name: image_document.name,
          })
        }
      }

    const event_date_start = itemsForm.event_date[0].toISOString()
    const event_date_end = itemsForm.event_date[1].toISOString()

    const modalRequst: Omit<
      Tforminternational,
      'event_date' | 'field_id' | 'id'
    > = {
      event_date_start,
      event_date_end,
      country_id: router.query.country as string,
      ir_topic_id: toppicId,
      event_name: itemsForm.event_name,
      event_venue: itemsForm.event_venue,
      leader_name_thai: itemsForm.leader_name_thai,
      leader_name_foreign: itemsForm.leader_name_foreign,
      specific_field: createReason,
      file_documents: createValuesReasonFile,
      image_documents: createValuesReasonImage,
      ir_topic_breadcrumb: null,
    }
    try {
      await editInternationalDatasService(modalRequst, internationalId)
    } catch (error) {
      message.error('เกิดข้อผิดพลาดบางอย่าง')
      return
    } finally {
      message.success('แก้ไขข้อมูลสำเร็จ')
      formInternational.resetFields()
      setIsModalOpen(!isModalOpen)
      randerQueryApi()
    }
  }

  const rowSelection: TableRowSelection<
    TallFieldInternationalRelationsdatas['data']
  > = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) =>
      setSelectedRowKeys(newSelectedRowKeys),
  }

  const RenderPDF = useCallback(() => {
    const arr: TfieldInternationdata[] = []
    if (selectedRowKeys.length > 0) {
      for (let i = 0; i < selectedRowKeys.length; i++) {
        const id = selectedRowKeys[i] as string
        const findSelect = dataSource?.find((e) => e.id === id) as any
        if (typeof findSelect !== 'undefined') {
          arr.push(findSelect)
        }
      }
    }
    return <ReactPDFDoc items={arr} />
  }, [dataSource, selectedRowKeys])

  const PDFonload = () => (
    <PDFDownloadLink document={<RenderPDF />} fileName='PDF-report.pdf'>
      {({ loading }: any) => (
        <span color='#fff'>{loading ? 'Loading...' : 'PDF'}</span>
      )}
    </PDFDownloadLink>
  )

  const handleExportxlxs = () => {
    const arr: TfieldInternationdata[] = []
    if (selectedRowKeys.length > 0) {
      for (let i = 0; i < selectedRowKeys.length; i++) {
        const id = selectedRowKeys[i] as string
        const findSelect = dataSource?.find((e) => e.id === id) as any
        if (typeof findSelect !== 'undefined') {
          arr.push(findSelect)
        }
      }
    }
    const toppicName = [
      ['', 'หัวข้อทั่วไป'],
      [
        'ลำดับ',
        'ชื่อกิจกรรม',
        'สถานที่จัดกิจกรรม',
        'หัวหน้าคณะฝ่ายไทย',
        'หัวหน้าคณะฝ่ายต่างประเทศ',
        'วันที่เริ่มต้น',
        'วันที่สิ้นสุด',
      ],
    ]
    const getData = arr.map((item, num) => [
      num + 1,
      item.event_name,
      item.event_venue,
      item.leader_name_thai,
      item.leader_name_foreign,
      item.event_date_start,
      item.event_date_end,
    ])

    const addToppicSpecific: string[] = []
    for (let z = 0; z < arr.length; z++) {
      const item = arr[z]
      for (let s = 0; s < getData.length; s++) {
        const lengthofnull = getData[s]
        for (let index = 0; index < lengthofnull.length - 2; index++) {
          addToppicSpecific.push(``)
        }
        for (let t = 0; t < item.specific_field.length; t++) {
          const keyname = item.specific_field[t]
          if (keyname) {
            addToppicSpecific.push(keyname.topic_reason_name)
            keyname.sub_reason_name
          }
        }
      }
    }

    const formatData = [[...toppicName[0], ...addToppicSpecific], ...getData]
    console.log('formatData', formatData)

    const workbook = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([])
    XLSX.utils.sheet_add_aoa(ws, formatData, { origin: 'A1' })

    const columnWidths = [
      { wch: 10 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 40 },
      { wch: 40 },
      { wch: 10 },
      { wch: 20 },
      { wch: 20 },
    ]
    const merges = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 6 } }]
    const cellRef = `B1`

    ws[cellRef] = {
      ...ws[cellRef],
      s: {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true,
      },
    }
    ws['!merges'] = merges
    ws['!cols'] = columnWidths

    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1')
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
    // const blob = new Blob([buffer], {
    //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // })
    // console.log('blob', blob)
    // const url = URL.createObjectURL(blob)
    download(buffer, `Excel-file`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    // const a = document.createElement('a')
    // a.href = url
    // a.target = '_blank'
    // a.click()
  }

  return (
    <>
      <Title>ค้นหาข้อมูล</Title>
      <ContentCount>พบข้อมูล: {dataSource?.length ?? 0} รายการ</ContentCount>
      <Row style={{ paddingTop: 10 }}>
        <Col xs={24} xl={6} span={6}>
          <Form
            form={form}
            layout='vertical'
            autoComplete='off'
            onFinish={onFinish}
          >
            <Form.Item name='search'>
              <Input
                defaultValue={menuSelector.search}
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
        <Col xs={24} xl={12} span={8}>
          <Form.Item>
            <BtnMain
              onClick={() => {
                form.submit()
              }}
            >
              ค้นหา
            </BtnMain>
            {path.toppic && (
              <BtnMain
                onClick={() => {
                  setActiontype('add')
                }}
              >
                <PlusCircleOutlined /> เพิ่ม
              </BtnMain>
            )}
            <BtnMain onClick={() => setIsOpenExport(true)}>Export</BtnMain>
            <BtnMain
              disabled={selectedRowKeys.length === 0}
              bgColor='#15bf3a'
              onClick={handleExportxlxs}
            >
              Excel
            </BtnMain>
          </Form.Item>
        </Col>
      </Row>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        {/* <Tablestyld
          style={{ borderRadius: ' 16px 16px 0 0'}}
          rowKey={'id'}
          columns={columns}
          dataSource={dataSource}
        /> */}
        <Table
          style={{ borderRadius: ' 16px 16px 0 0' }}
          rowKey={'id'}
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: '100%', y: '100%' }}
          rowSelection={rowSelection}
        />
      </div>

      <Modal
        title={`${mode == 'edit' ? 'แก้ไข' : 'ดู'}หัวข้อความสัมพันธ์`}
        open={isModalOpen}
        onOk={() => formInternational.submit()}
        onCancel={() => setIsModalOpen(!isModalOpen)}
        width={800}
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
                <Input
                  disabled={
                    mode === EmodeOption.VIEW || mode === EmodeOption.EDIT
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                id='event_name'
                label='ชื่อกิจกรรม'
                name='event_name'
                rules={[{ required: true }]}
              >
                <Input disabled={mode === EmodeOption.VIEW} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                id='event_venue'
                label='สถานที่จัดกิจกรรม'
                name='event_venue'
              >
                <Input disabled={mode === EmodeOption.VIEW} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                id='leader_name_thai'
                label='หัวหน้าคณะฝ่ายไทย'
                name='leader_name_thai'
              >
                <Input disabled={mode === EmodeOption.VIEW} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                id='leader_name_foreign'
                label='หัวหน้าคณะฝ่ายต่างประเทศ'
                name='leader_name_foreign'
              >
                <Input disabled={mode === EmodeOption.VIEW} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='event_date'
                label='ห้วงเวลาเริ่มต้น - สิ้นสุด'
                rules={[{ required: true }]}
              >
                <DatePicker.RangePicker
                  disabled={mode === EmodeOption.VIEW}
                  format={'DD/MM/YYYY'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <FormUpload
                disabled={mode === EmodeOption.VIEW}
                form={formInternational}
                type='file'
                name='file_documents'
                acceptFile='.pdf,.xlsx,.doc,.ptt'
                randerList={
                  typeof renderFiles !== 'undefined'
                    ? renderFiles.docs
                    : undefined
                }
                ticpidId={toppicId}
              />
            </Col>
            <Col span={12}>
              <FormUpload
                disabled={mode === EmodeOption.VIEW}
                form={formInternational}
                type='image'
                name='image_documents'
                acceptFile='.jpg,.png,.svg,.webp'
                randerList={
                  typeof renderFiles !== 'undefined'
                    ? renderFiles.img
                    : undefined
                }
                ticpidId={toppicId}
              />
            </Col>
          </Row>

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
                              <FormUploadInput
                                label={item.name}
                                keys={item.name + index}
                                form={form}
                                name={[
                                  'specific_field',
                                  specific.topic_reason_name,
                                  item.name,
                                  'upload',
                                ]}
                              />
                            </>
                          }
                        >
                          <Input disabled={mode === EmodeOption.VIEW} />
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

      {/* modal report */}
      <Modal
        open={isopenExport}
        width={800}
        onCancel={() => setIsOpenExport(false)}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{'ข้อมูลพื้นฐานประเทศ'}</span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                columnGap: 1,
                alignItems: 'center',
              }}
            >
              <span>Download</span>
              <BtnMain
                bgColor='#9a2020'
                disabled={selectedRowKeys.length === 0}
                onClick={PDFonload}
              >
                <PDFonload />
              </BtnMain>
              <BtnMain>
                <span>Word</span>
              </BtnMain>
            </div>
          </div>
        }
        closeIcon={false}
      >
        {selectedRowKeys.length > 0 ? (
          <PDFViewer style={{ width: '100%' }} height={600}>
            <RenderPDF />
          </PDFViewer>
        ) : null}
      </Modal>
    </>
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
const BtnMain = styled(Button) <{ bgColor?: string }>`
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
const Tablestyld = styled(Table)`
  .ant-table-thead tr th {
    background: #00408E;
    color: #fff;
  }
`;