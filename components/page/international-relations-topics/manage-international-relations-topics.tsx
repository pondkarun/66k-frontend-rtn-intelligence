import {
  Badge,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Space,
  message,
} from 'antd'
import React, { useState, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { isArray, isPlainObject } from 'lodash'
import FormUpload from '@/components/shares/FormUpload'
import {
  TdocumentsOption,
  Tforminternational,
} from '@/interface/international_relations_datas.interface'
import { addInternationalDataRelationsTopicsService } from '@/services/internationalRelationsDatas'
import { TMapReason } from '@/interface/international_relations_topics.interface'
import { setActionFormInput } from '@/redux/actions/commonAction'
import { internalUploadPublicService } from '@/services/upload'
import trimDataString from '@/libs/trimFormDataString'
import FormUploadInput, { Icon } from './country/FormUploadInput'
import { InfoCircleOutlined } from '@ant-design/icons'

type SpecificFieldType = {
  groups: string
  suggestion?: string
  value: string[]
  detail?: string[]
}

type ManageInternationalRelationsTopicsType = {
  mode: 'add' | 'edit'
}

//#region -> styled
const Title = styled('h1')`
  color: #00408e;
  font-size: 36px;
  font-weight: revert;
  margin-bottom: 0em;
`
const SubTitle = styled('div')`
  font-size: 1.75rem;
  color: #565252;
`

const Line = styled('div')`
  height: 0px;
  border: 1px solid #d9d9d9;
  position: relative;
  margin: 2px 0px 10px 0px;
`

//#endregion

const ManageInternationalRelationsTopics = (
  props: ManageInternationalRelationsTopicsType,
) => {
  const { mode } = props
  const router = useRouter()
  const [idAdd, setIdAdd] = useState(uuidv4())
  const [isModalOpenInfo, setIsModalOpenInfo] = useState(false)
  const [finalSubmit, setFinalSubmit] = useState(false)
  const [suggestion, setSuggestion] = useState<string>("")

  const dispatch = useDispatch()
  const { toppic_obj } = useSelector(({ toppic_menu }) => toppic_menu)
  const [form] = Form.useForm<Tforminternational>()

  const onFinishFailed = () => {
    message.warning('กรอกข้อมูลให้ครบถ้วน')
  }

  const onFinish = async () => {
    const data: any = form.getFieldValue(undefined)
    const createReason: TMapReason = []
    const createValuesReasonImage: TdocumentsOption = []
    const createValuesReasonImageHeader: TdocumentsOption = []
    const createValuesReasonFile: TdocumentsOption = []
    const id = idAdd

    if (isPlainObject(data.specific_field)) {
      for (const [key1, values] of Object.entries(
        data.specific_field as unknown as never,
      )) {
        const subReason = []
        const fields = Object.entries(values as unknown as never)

        for (let index = 0; index < fields.length; index++) {
          const imgMap = [],
            filemap = []
          const element = fields[index] as any
          let upload: any = undefined
          if (element[1].upload) {
            const _u = element[1].upload
            upload = {}
            if (isArray(_u.image)) {
              for (let o = 0; o < _u.image.length; o++) {
                const imgPath: any = _u.image[o]
                const responseImage = await internalUploadPublicService({
                  formData: imgPath,
                  country_id: router.query.country as string,
                  ticpid_id: router.query.toppic as string,
                  dir: id,
                })
                if (responseImage.message === 'OK') {
                  const urlPath = responseImage.data as string[]
                  const urlFile = urlPath.find(
                    (_url: string) =>
                      _url.split('/')[_url.split('/').length - 1] ===
                      imgPath.name,
                  )
                  imgMap.push({
                    name: imgPath.name,
                    url: urlFile,
                  })
                }
              }
              upload.image = imgMap.map((e: any) => {
                return {
                  url: e.url,
                  name: e.name,
                }
              })
            }

            if (isArray(_u.file)) {
              for (let o = 0; o < _u.file.length; o++) {
                const filePath: any = _u.file[o]
                const responseImage = await internalUploadPublicService({
                  formData: filePath,
                  country_id: router.query.country as string,
                  ticpid_id: router.query.toppic as string,
                  dir: id,
                })
                if (responseImage.message === 'OK') {
                  const urlPath = responseImage.data as string[]
                  const urlFile = urlPath.find(
                    (_url: string) =>
                      _url.split('/')[_url.split('/').length - 1] ===
                      filePath.name,
                  )
                  filemap.push({
                    name: filePath.name,
                    url: urlFile,
                  })
                }
              }
              upload.file = filemap.map((e: any) => {
                return {
                  url: e.url,
                  name: e.name,
                }
              })
            }
          }
          subReason.push({
            name: element[0],
            value: element[1].value,
            upload,
          })
        }

        createReason.push({
          topic_reason_name: key1,
          sub_reason_name: subReason,
        })
      }
    }

    let fileUploadedImg: any, fileUploadedDoc: any, fileheaderImg: any

    if (data.image_documents) {
      fileUploadedImg = await internalUploadPublicService({
        formData: data.image_documents,
        country_id: router.query.country as string,
        ticpid_id: router.query.toppic as string,
        dir: id,
      })
    }
    if (data.file_image_header) {
      fileheaderImg = await internalUploadPublicService({
        formData: data.file_image_header,
        country_id: router.query.country as string,
        ticpid_id: router.query.toppic as string,
        dir: id,
      })
    }
    if (data.file_documents) {
      fileUploadedDoc = await internalUploadPublicService({
        formData: data.file_documents,
        country_id: router.query.country as string,
        ticpid_id: router.query.toppic as string,
        dir: id,
      })
    }

    if (fileUploadedDoc) {
      for (let x = 0; x < data.file_documents.length; x++) {
        const file_document = data.file_documents[x]
        const url = fileUploadedDoc.data[x]
        createValuesReasonFile.push({
          url,
          name: file_document.name,
        })
      }
    }

    if (fileUploadedImg) {
      for (let z = 0; z < data.image_documents.length; z++) {
        const image_document = data.image_documents[z]
        const url = fileUploadedImg.data.find((_url: string) => _url.split('/')[_url.split('/').length - 1] === image_document.name)
        createValuesReasonImage.push({
          url,
          name: image_document.name,
        })
      }
    }

    if (fileheaderImg) {
      const image_doc_header = data.file_image_header[0]
      if (image_doc_header) {
        const url = fileUploadedImg.data.find((_url: string) => _url.split('/')[_url.split('/').length - 1] === image_doc_header.name)
        createValuesReasonImageHeader.push({
          url,
          name: image_doc_header.name,
        })
      }
      
    }

    const event_date_start = dayjs(data.event_date[0]) as unknown as string
    const event_date_end = dayjs(data.event_date[1]) as unknown as string

    const modalRequst: Omit<Tforminternational, 'event_date' | 'field_id'> = {
      id,
      event_date_start,
      event_date_end,
      country_id: router.query.country as string,
      ir_topic_id: router.query.toppic as string,
      event_name: data.event_name,
      event_venue: data.event_venue,
      leader_name_thai: data.leader_name_thai,
      leader_name_foreign: data.leader_name_foreign,
      specific_field: createReason,
      file_documents: createValuesReasonFile,
      image_documents: {
        img_haader: createValuesReasonImageHeader,
        img_doc: createValuesReasonImage,
      },
      ir_topic_breadcrumb: null,
    }

    try {
      await addInternationalDataRelationsTopicsService(modalRequst)
      form.resetFields()
      setFinalSubmit(!finalSubmit)
      message.success('เพิ่มข้อมูลสำเร็จ')
      dispatch(setActionFormInput(''))
    } catch (error) {
      message.error('เกิดข้อผิดพลาดบางอย่าง')
    }
  }

  return (
    <>
      <Title>
        {mode == 'add' ? 'เพิ่ม' : 'แก้ไข'}ข้อมูล {toppic_obj?.name}
      </Title>
      <SubTitle>
        {mode != 'add' &&
          `พบข้อมูล :
          ${toppic_obj.guide_line_specific_field
            ? toppic_obj.guide_line_specific_field[0].value.length
            : 0
          }{' '}
          รายการ`}
      </SubTitle>

      <SubTitle style={{ paddingTop: 20 }}>ข้อมูลทั่วไป</SubTitle>
      <Line />
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12} span={12}>
            <Form.Item
              name='event_name'
              label='ชื่อกิจกรรม'
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} span={12}>
            <Form.Item name='event_venue' label='สถานที่จัดกิจกรรม'>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} span={12}>
            <Form.Item name='leader_name_thai' label='หัวหน้าคณะฝ่ายไทย'>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} span={12}>
            <Form.Item
              name='leader_name_foreign'
              label='หัวหน้าคณะฝ่ายต่างประเทศ'
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} span={12}>
            <Form.Item
              name='event_date'
              label='ห้วงเวลาเริ่มต้น - สิ้นสุด'
              rules={[{ required: true }]}
            >
              <DatePicker.RangePicker format={'DD/MM/YYYY'} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12} span={12}>
            <FormUpload
              form={form}
              type='file'
              name='file_documents'
              acceptFile='.pdf,.xlsx,.docx,.ptt'
              dir={idAdd}
            />
          </Col>
          <Col xs={24} md={12} span={12}>
            <FormUpload
              form={form}
              type='image'
              name='image_documents'
              acceptFile='.jpg,.png,.svg,.webp'
              dir={idAdd}
            />
          </Col>
        </Row>

        <Modal open={isModalOpenInfo} title="Information Suggestion" onCancel={() => setIsModalOpenInfo(false)} footer={<></>}>
          <div style={{ whiteSpace: "pre-line" }}>
            {suggestion}
          </div>
        </Modal>

        {toppic_obj?.guide_line_specific_field?.map(
          (e: SpecificFieldType, index: number) => {
            return (
              <Fragment key={e.groups + index}>
                <SubTitle>{e.groups} {e.suggestion ? <Icon
                  onClick={() => {
                    setIsModalOpenInfo(!isModalOpenInfo)
                    setSuggestion(e.suggestion ?? "")
                  }}
                >
                  <Badge>
                    <InfoCircleOutlined />
                  </Badge>
                </Icon> : null}
                </SubTitle>

                <Line />

                <Row gutter={[16, 0]}>
                  {e.value.map((item: string, index: number) => {
                    return (
                      <Col xs={24} md={12} span={12} key={item + index}>
                        <Form.Item
                          name={['specific_field', e.groups, item, 'value']}
                          label={
                            <FormUploadInput
                              label={item}
                              keys={item + index}
                              id={item}
                              form={form}
                              name={[
                                'specific_field',
                                e.groups,
                                item,
                                'upload',
                              ]}
                              dir={idAdd}
                              mode={mode}
                            // detail={e.detail?.[index]}
                            />
                          }
                        >
                          <Input.TextArea autoSize />
                        </Form.Item>
                      </Col>
                    )
                  })}
                </Row>
              </Fragment>
            )
          },
        )}
        <Space>
          <Button
            type='primary'
            onClick={() => {
              trimDataString(form)
              form.submit()
            }}
          >
            บันทึก
          </Button>
          <Button
            onClick={() => {
              dispatch(setActionFormInput(''))
            }}
          >
            ยกเลิก
          </Button>
        </Space>
      </Form >
    </>
  )
}

export default ManageInternationalRelationsTopics
