import { InboxOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Col, Form, Modal, Row, Upload } from 'antd'
import React, { useState, Fragment, useEffect } from 'react'
import styled from 'styled-components'
import { BsImage } from 'react-icons/bs'
import { RcFile } from 'antd/lib/upload'
import { useRouter } from 'next/router'
import getBase64 from '@/libs/getBase64'
import type { UploadFile, UploadProps } from 'antd'

interface MatterDocsUploadProps {
  open: boolean
  onCancel: (k: boolean) => void
  text?: string
  fileId: string
  mainKey: string
  id?: string
}

const MatterImgupload = ({
  open,
  onCancel,
  text,
  fileId,
  mainKey,
  id,
}: MatterDocsUploadProps) => {
  const [file, setFile] = useState<any>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileType, setFileType] = useState<string | undefined>()

  const router = useRouter()
  const params = router.query

  const { Dragger } = Upload

  const [form] = Form.useForm<any>()

  const propsDragger: UploadProps = {
    multiple: true,
    action: '/api/upload',
    accept: '.jpg,.png,.svg,.webp',
    onChange: async (info) => {
      info.file.status = 'done'
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
    accept: '.jpg,.png,.svg,.webp',
    onChange: async (info) => {
      info.file.status = 'done'
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
    accept: '.jpg,.png,.svg,.webp',
    action: '/api/upload',
    onChange: (info) => {
      console.log('info', info)
      info.file.status = 'done'
      setFile(info.fileList)
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
      handlePreview(e)
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setFileType(file.type?.split('/')[1])
    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)

    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    )
  }

  const handleOk = (data: any) => {
    console.log('lits', data)
    const _file = file
    const name = _file.name

    const createFile: {
      name: string
      url: string
      toppic_name: string
      sub_toppic_name: string
    }[] = []

    for (let i = 0; i < _file.length; i++) {
      const fie = _file[i]
      createFile.push({
        name: fie.name,
        url: '',
        toppic_name: mainKey,
        sub_toppic_name: id as string,
      })
    }

    const modal = {
      uploads: {
        files: [],
        images: createFile,
      },
    }
    console.log('modal', modal)
    // state set over here //

    onCancel(false)
  }

  useEffect(() => {
    if (file) {
      form.setFieldsValue({
        uploads: {
          files: [],
          images: file,
        },
      })
    }
  }, [file])

  const normFile = (e: any) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  return (
    <Fragment key={fileId}>
      <Modal
        width={700}
        title={
          <>
            <BsImage /> แนบไฟล์ภาพ
          </>
        }
        open={open}
        onOk={handleOk}
        onCancel={() => onCancel(false)}
        // footer={<></>}
      >
        <Title>{text}</Title>
        <label>{`อัพโหลดไฟล์เอกสาร (jpg, png, svg)`}</label>

        {/* <Dragger {...propsDragger}>
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
            <Upload {...propsButton}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Col>
          <Col span={24}>
            <Upload {...propsUpload} listType={'picture-card'} />
          </Col>
        </Row> */}
        <Form name='validate_other' onFinish={handleOk}>
          <Form.Item
            name='dragger'
            valuePropName='fileList'
            getValueFromEvent={normFile}
            noStyle
          >
            <Upload.Dragger name='files' action='/upload.do'>
              <p className='ant-upload-drag-icon'>
                <InboxOutlined />
              </p>
              <p className='ant-upload-text'>
                Click or drag file to this area to upload
              </p>
              <p className='ant-upload-hint'>
                Support for a single or bulk upload.
              </p>
            </Upload.Dragger>
          </Form.Item>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form>
      </Modal>
    </Fragment>
  )
}

export default MatterImgupload

const Title = styled.h1`
  color: #00408e;
  font-size: 36px;
  font-weight: revert;
  margin-bottom: 0em;
`
