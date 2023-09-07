import { Badge, FormInstance, Modal } from 'antd'
import React, { Fragment, useState } from 'react'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { BsImage } from 'react-icons/bs'
import styled from 'styled-components'
import MatterImgupload from './MatterImgupload'
import MatterDocsUpload from './MatterDocsUpload'
import FormUpload from '@/components/shares/FormUpload'

interface FormUploadInputProps {
  label?: string
  keys: string
  mainKey: string
  id?: string
  form: any
  name: any
}

const FormUploadInput = (props: FormUploadInputProps) => {
  const { label, mainKey, keys, id, form, name } = props

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [type, setType] = useState<'image' | 'file' | null>(null)

  return (
    <Fragment key={keys}>
      <ContainerBox>
        <span>{label}</span>
        <Icon
          onClick={() => {
            setIsModalOpen(!isModalOpen)
            setType('file')
          }}
        >
          <Badge>
            <HiOutlineDocumentText />
          </Badge>
        </Icon>
        <Icon
          onClick={() => {
            setIsModalOpen(!isModalOpen)
            setType('image')
          }}
        >
          <Badge>
            <BsImage />
          </Badge>
        </Icon>
      </ContainerBox>

      {type ?
        <Modal open={isModalOpen} onOk={() => {
          console.log(' form.getFieldValue(name) :>> ', form.getFieldValue());
        }} onCancel={() => setIsModalOpen(false)}>
          <FormUpload
            form={form}
            type={type}
            name={[...name, type]}
            acceptFile={type == "file" ? '.pdf,.xlsx,.doc,.ptt' : ".jpg,.png,.svg,.webp"}
          />

        </Modal>

        : null}
    </Fragment>
  )
}

export default FormUploadInput

const ContainerBox = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;
`
const Icon = styled.span`
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
