import { Badge } from 'antd'
import React, { Fragment, useState } from 'react'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { BsImage } from 'react-icons/bs'
import styled from 'styled-components'
import MatterImgupload from './MatterImgupload'
import MatterDocsUpload from './MatterDocsUpload'

interface FormUploadInputProps {
  label?: string
}

const FormUploadInput = (props: FormUploadInputProps) => {
  const { label } = props

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [type, setType] = useState<'image' | 'file' | null>(null)

  return (
    <Fragment>
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
      {type === 'file' ? (
        <MatterDocsUpload
          open={isModalOpen}
          onCancel={setIsModalOpen}
          text={label}
        />
      ) : (
        <MatterImgupload
          open={isModalOpen}
          onCancel={setIsModalOpen}
          text={label}
        />
      )}
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
