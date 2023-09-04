import { Badge, Button, Col, Modal, Row, Upload } from 'antd'
import React, { Fragment, useState } from 'react'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { BsImage } from 'react-icons/bs'
import styled from 'styled-components'
import { InboxOutlined } from '@ant-design/icons'

interface FormUploadInputProps {
  label?: string
}

const FormUploadInput = (props: FormUploadInputProps) => {
  const { label } = props

  const { Dragger } = Upload

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [type, setType] = useState<'image' | 'file' | null>(null)
  // const [inputFileDocs, setInputFileDocs] =

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
        // onOk={handleOk}
        onCancel={() => setIsModalOpen(!isModalOpen)}
        footer={<></>}
      >
        <Title>{label}</Title>
        <label>{`อัพโหลดไฟล์เอกสาร ${
          type == 'file' ? '(xlsx, docx, ptt, pdf)' : '(jpg, png, svg)'
        }`}</label>

        <Dragger>
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>
            คลิกหรือลากไฟล์ไปยังพื้นที่นี้ เพื่ออัปโหลด
          </p>
          <p className='ant-upload-hint'>
            สนับสนุนสำหรับการอัปโหลดครั้งเดียวหรือจำนวนมาก
          </p>
        </Dragger>
        <Row style={{ padding: 10 }}>
          <>
            <Col span={12}>
              <h3>อัพโหลดไฟล์</h3>
            </Col>
            <Col span={12} style={{ textAlign: 'end' }}>
              <Upload>
                <Button>Click to Upload</Button>
              </Upload>
            </Col>
          </>

          <Col span={24}>
            {type == 'image' ? (
              <Upload listType={'picture-card'} />
            ) : (
              <Upload listType={'text'} />
            )}
          </Col>
        </Row>
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
const Title = styled.h1`
  color: #00408e;
  font-size: 36px;
  font-weight: revert;
  margin-bottom: 0em;
`
