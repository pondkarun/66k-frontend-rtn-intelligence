import { Badge, Form, Modal } from 'antd'
import React, { useState } from 'react'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { BsImage } from 'react-icons/bs'
import styled from 'styled-components'
import FormUpload from '@/components/shares/FormUpload'

type IconUploadType = {
  label: string
  form: any
  name: string[]
}

const LabelIconUpload = ({ label, form, name }: IconUploadType) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [type, setType] = useState<'image' | 'file' | null>(null)
  const [countFile, setCountFile] = useState<number>(0)
  const [countImage, setCountImage] = useState<number>(0)
  const [formUpload]: any = Form.useForm()

  const nameForm = name[name.length - 1]

  const onClick = (type: 'image' | 'file') => {
    setType(type)
    setIsModalOpen(true)
    setFormValue(type)
  }

  const handleOk = () => {
    setIsModalOpen(false)
    if (type) setFormValue(type)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    if (type) setFormValue(type)
  }

  const setFormValue = (type: 'image' | 'file') => {
    // console.log('nameForm :>> ', nameForm);
    // console.log('name :>> ', name);
    const formName = form.getFieldValue(name)
    if (!formName) {
      form.setFieldValue(name, {
        upload: {
          image: [],
          file: [],
        },
      })
    }

    console.log(' formUpload.getFieldValue :>> ', formUpload.getFieldValue())
    const _nameForm = formUpload.getFieldValue(`${type}-${nameForm}`)
    console.log('_nameForm :>> ', _nameForm, `${type}-${nameForm}`)
    const setData = { ...formName }
    // console.log('setData :>> ', setData);

    if (type && setData) {
      if (!setData.upload)
        setData.upload = {
          image: [],
          file: [],
        }
      setData.upload[type] = _nameForm
    }
    form.setFieldValue(name, setData)
    const _formName = form.getFieldValue(name)
    // console.log('_formName :>> ', _formName);

    if (_formName.upload) {
      setCountImage(_formName.upload.image?.length)
      setCountFile(_formName.upload.file?.length)
    }
  }

  return (
    <>
      <span>{label}</span>
      <Icon onClick={() => onClick('file')}>
        <Badge count={countFile}>
          <HiOutlineDocumentText />
        </Badge>
      </Icon>
      <Icon onClick={() => onClick('image')}>
        {' '}
        <Badge count={countImage}>
          <BsImage />
        </Badge>
      </Icon>

      <Modal
        width={700}
        title={
          type == 'file' ? (
            <>
              <HiOutlineDocumentText /> แนบไฟล์เอกสาร
            </>
          ) : (
            <>
              <BsImage /> แนบไฟล์ภาพ
            </>
          )
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={<></>}
      >
        <Title>{label}</Title>

        {isModalOpen && nameForm ? (
          type == 'file' ? (
            <FormUpload
              form={formUpload}
              type='file'
              name={`file-${nameForm}`}
              acceptFile='.pdf,.xlsx,.doc,.ptt'
            />
          ) : (
            <FormUpload
              form={formUpload}
              type='image'
              name={`image-${nameForm}`}
              acceptFile='.jpg,.png,.svg,.webp'
            />
          )
        ) : null}
      </Modal>
    </>
  )
}

export default LabelIconUpload

const Title = styled.h1`
  color: #00408e;
  font-size: 36px;
  font-weight: revert;
  margin-bottom: 0em;
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
