import { InboxOutlined } from '@ant-design/icons'
import { Button, Col, Modal, Row, Upload, message } from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import React, { useState } from 'react'
import { HiOutlineDocumentText } from 'react-icons/hi'
import styled from 'styled-components'
import type { UploadProps } from 'antd'

interface MatterDocsUploadProps {
  open: boolean
  onCancel: (k: boolean) => void
  text?: string
}

const MatterDocsUpload = ({ open, onCancel, text }: MatterDocsUploadProps) => {
  const [file, setFile] = useState<any>([])

  const propsDragger: UploadProps = {
    multiple: true,
    action: '/api/upload',
    accept: '.pdf,.xlsx,.doc,.ptt',
    onChange: async (info) => {
      setFile([...file, ...info.fileList])
      // console.log('info :>> ', info);
      // const fileUploaded = await internalUploadPublicService({
      //   formData: info.fileList,
      //   country_id: params.country as string,
      //   ticpid_id: params.toppic
      //     ? (params.toppic as string)
      //     : (ticpidId as string),
      // })
      // if (fileUploaded === 'OK') {
      //   info.file.status = 'done'
      //   setFile([...file, ...info.fileList])
      // }
    },
    fileList: [],
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }
  const propsButton: UploadProps = {
    multiple: true,
    action: '/api/upload',
    accept: '.pdf,.xlsx,.doc,.ptt',
    onChange: async (info) => {
      setFile([...file, ...info.fileList])
      // console.log('propsButton :>> ', info)
      // const fileUploaded = await internalUploadPublicService({
      //   formData: info.fileList,
      //   country_id: params.country as string,
      //   ticpid_id: params.toppic
      //     ? (params.toppic as string)
      //     : (ticpidId as string),
      // })
      // if (fileUploaded === 'OK') {
      //   info.file.status = 'done'
      //   setFile([...file, ...info.fileList])
      // }
    },
    fileList: [],
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }
  const propsUpload: UploadProps = {
    multiple: true,
    accept: '.pdf,.xlsx,.doc,.ptt',
    action: '/api/upload',
    onChange: (info) => {
      setFile([...file, ...info.fileList])
      // try {
      //   removeInternalUploadPublicService({
      //     country_id: params.country as string,
      //     ticpid_id: params.toppic
      //       ? (params.toppic as string)
      //       : (ticpidId as string),
      //     file_name: info.file.name,
      //   })
      //   setFile(info.fileList)
      // } catch (error) {
      //   setFile([])
      // }
    },
    fileList: file,
    onPreview(e) {
      // handlePreview(e)
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }
  return (
    <>
      <Modal
        width={700}
        title={
          <>
            <HiOutlineDocumentText /> แนบไฟล์เอกสาร
          </>
        }
        open={open}
        // onOk={handleOk}
        onCancel={() => onCancel(false)}
        footer={<></>}
      >
        <Title>{text}</Title>
        <label>{`อัพโหลดไฟล์เอกสาร (xlsx, docx, ptt, pdf)`}</label>

        <Dragger {...propsDragger}>
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
          <Col span={12}>
            <h3>อัพโหลดไฟล์</h3>
          </Col>
          <Col span={12} style={{ textAlign: 'end' }}>
            <Upload>
              <Button>Click to Upload</Button>
            </Upload>
          </Col>

          <Col span={24}>
            <Upload {...propsUpload} listType='text' />
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default MatterDocsUpload

const Title = styled.h1`
  color: #00408e;
  font-size: 36px;
  font-weight: revert;
  margin-bottom: 0em;
`
