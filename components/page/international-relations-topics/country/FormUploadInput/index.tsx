import { Badge, Modal } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { BsImage } from 'react-icons/bs'
import styled from 'styled-components'
import FormUpload from '@/components/shares/FormUpload'
import { isArray } from 'lodash'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Text } from '@react-pdf/renderer'

interface FormUploadInputProps {
  label?: string
  keys: string
  id?: string
  form: any
  name: any
  dir?: string
}

const FormUploadInput = (props: FormUploadInputProps) => {
  const { label, keys, form, name, dir } = props

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpenInfo, setIsModalOpenInfo] = useState(false)
  const [type, setType] = useState<'image' | 'file' | null>(null)
  const [countImage, setCountImage] = useState(0);
  const [countFile, setCountFile] = useState(0);
  const [dirPath, setDirPath] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (dir && isArray(name)) {
      let _dir = ""
      name.forEach((i: string) => {
        _dir += `${i}/`
      });
      setDirPath(_dir)
    }
    setCount()
  }, [])

  useEffect(() => {
    setCount()
  }, [isModalOpen])

  const setCount = () => {
    const formData = form.getFieldValue(name);
    setCountImage(formData?.image?.length)
    setCountFile(formData?.file?.length)
  }

  return (
    <Fragment key={keys}>
      <ContainerBox>
        <span>{label}</span>
        {/* <Icon
          onClick={() => {
            setIsModalOpenInfo(!isModalOpenInfo)
          }}
        >
          <Badge count={countFile}>
            <InfoCircleOutlined />
          </Badge>
        </Icon> */}

        <Icon
          onClick={() => {
            setIsModalOpen(!isModalOpen)
            setType('file')
          }}
        >
          <Badge count={countFile}>
            <HiOutlineDocumentText />
          </Badge>
        </Icon>
        <Icon
          onClick={() => {
            setIsModalOpen(!isModalOpen)
            setType('image')
          }}
        >
          <Badge count={countImage}>
            <BsImage />
          </Badge>
        </Icon>
      </ContainerBox>

      {type ?
        <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={<></>}>
          <FormUpload
            form={form}
            type={type}
            name={[...name, type]}
            acceptFile={type == "file" ? '.pdf,.xlsx,.doc,.ptt' : ".jpg,.png,.svg,.webp"}
            dir={dirPath ? `${dirPath}${type}` : undefined}
          />

        </Modal>

        : null}

      <Modal open={isModalOpenInfo} title="Information suggestion" onCancel={() => setIsModalOpenInfo(false)} footer={<></>}>
        <div style={{ whiteSpace: "pre-line" }}>
          {` ด้านการศึกษา: .................... \n
          ด้านการฝึก: ....................  \n
          ด้านความร่วมมือ: ....................  \n`}
        </div>
      </Modal>
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
