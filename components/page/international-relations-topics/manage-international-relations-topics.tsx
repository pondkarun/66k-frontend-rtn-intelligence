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
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import FormUpload from '@/components/shares/FormUpload'
import {
  TdocumentsOption,
  Tforminternational,
} from '@/interface/international_relations_datas.interface'
import { addInternationalDataRelationsTopicsService } from '@/services/internationalRelationsDatas'
import { TMapReason } from '@/interface/international_relations_topics.interface'
import LabelIconUpload from './country/LabelIconUpload'
import { ActionTprops } from './country'

type SpecificFieldType = {
  groups: string
  value: string[]
}

type ManageInternationalRelationsTopicsType = {
  mode: 'add' | 'edit'
  setActiontype: React.Dispatch<React.SetStateAction<ActionTprops>>
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
  const { mode, setActiontype } = props
  const router = useRouter()

  const [finalSubmit, setFinalSubmit] = useState(false)

  const { toppic_obj } = useSelector(({ toppic_menu }) => toppic_menu)
  const [form] = Form.useForm<Tforminternational>()

  const onFinish = async () => {
    const data = form.getFieldsValue()
    const createReason: TMapReason = []
    const createValuesReasonImage: TdocumentsOption = []
    const createValuesReasonFile: TdocumentsOption = []

    for (const [key1, values] of Object.entries(
      data.specific_field as unknown as never,
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

    for (let x = 0; x < data.file_documents.length; x++) {
      const file_document = data.file_documents[x]
      createValuesReasonFile.push({
        url: '',
        name: file_document.name,
      })
    }
    for (let z = 0; z < data.image_documents.length; z++) {
      const image_document = data.image_documents[z]
      createValuesReasonImage.push({
        url: '',
        name: image_document.name,
      })
    }

    const event_date_start = data.event_date[0].toISOString()
    const event_date_end = data.event_date[1].toISOString()

    const modalRequst: Omit<
      Tforminternational,
      'event_date' | 'field_id' | 'id'
    > = {
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
      image_documents: createValuesReasonImage,
      ir_topic_breadcrumb: null,
    }

    try {
      await addInternationalDataRelationsTopicsService(modalRequst)
    } catch (error) {
      message.error('เกิดข้อผิดพลาดบางอย่าง')
      return
    } finally {
      form.resetFields()
      setFinalSubmit(!finalSubmit)
      message.success('เพิ่มข้อมูลสำเร็จ')
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
          ${
            toppic_obj.guide_line_specific_field
              ? toppic_obj.guide_line_specific_field[0].value.length
              : 0
          }{' '}
          รายการ`}
      </SubTitle>

      <SubTitle style={{ paddingTop: 20 }}>ข้อมูลทั่วไป</SubTitle>
      <Line />

      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item
              name='event_name'
              label='ชื่อกิจกรรม'
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='event_venue' label='สถานที่จัดกิจกรรม'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='leader_name_thai' label='หัวหน้าคณะฝ่ายไทย'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='leader_name_foreign'
              label='หัวหน้าคณะฝ่ายต่างประเทศ'
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
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
          <Col span={12}>
            <FormUpload
              form={form}
              type='file'
              name='file_documents'
              acceptFile='.pdf,.xlsx,.doc,.ptt'
            />
          </Col>

          <Col span={12}>
            <FormUpload
              form={form}
              type='image'
              name='image_documents'
              acceptFile='.jpg,.png,.svg,.webp'
            />
          </Col>
        </Row>

        {toppic_obj?.guide_line_specific_field?.map((e: SpecificFieldType) => (
          <>
            <SubTitle>{e.groups}</SubTitle>
            <Line />

            <Row gutter={[16, 0]}>
              {e.value.map((item: string, index: number) => {
                return (
                  <Col span={12} key={item + index}>
                    <Form.Item
                      name={['specific_field', e.groups, item, 'value']}
                      label={
                        <LabelIconUpload
                          label={item}
                          form={form}
                          name={['specific_field', e.groups, item]}
                        />
                      }
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                )
              })}
            </Row>
          </>
        ))}
        <Space>
          <Button type='primary' onClick={() => form.submit()}>
            บันทึก
          </Button>
          <Button
            onClick={() => {
              setActiontype('')
            }}
          >
            ยกเลิก
          </Button>
        </Space>
      </Form>
    </>
  )
}

export default ManageInternationalRelationsTopics
