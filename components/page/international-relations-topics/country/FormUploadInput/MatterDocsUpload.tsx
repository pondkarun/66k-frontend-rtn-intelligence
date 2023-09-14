import { InboxOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Col, Modal, Row, Upload, Form } from 'antd'
import React, { useState, Fragment, useEffect } from 'react'
import { HiOutlineDocumentText } from 'react-icons/hi'
import styled from 'styled-components'
import { RcFile } from 'antd/lib/upload'
import { useRouter } from 'next/router'
import getBase64 from '@/libs/getBase64'
import {
  internalUploadPublicService,
  removeInternalUploadPublicService,
} from '@/services/upload'
import type { UploadFile, UploadProps } from 'antd'

interface MatterDocsUploadProps {
  open: boolean
  onCancel: (k: boolean) => void
  text?: string
  fileId: string
  mainKey: string
  id?: string
}

const MatterDocsUpload = ({
  open = false,
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

  const [form] = Form.useForm<any>()

  const { Dragger } = Upload

  const propsDragger: UploadProps = {
    multiple: true,
    action: '/api/upload',
    accept: '.pdf,.xlsx,.doc,.ptt',
    onChange: async (info) => {
      // console.log('info :>> ', info);
      info.file.status = 'done'
      setFile([...file, ...info.fileList])
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
      // console.log('propsButton :>> ', info)
      info.file.status = 'done'
      setFile([...file, ...info.fileList])
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
      try {
        removeInternalUploadPublicService({
          country_id: params.country as string,
          ticpid_id: params.toppic as string,
          file_name: info.file.name,
        })
        setFile(info.fileList)
      } catch (error) {
        setFile([])
      }
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
    console.log('file', file)
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setFileType(file.type?.split('/')[1])
    setPreviewImage(file.url || (file.preview as string))

    // const blob = new Blob([file.preview], {
    //   type: fileType,
    // })
    // console.log('blob', blob)
    // const a = document.createElement('a')
    // a.href = file.url ? file.url : (file.preview as string)
    // a.target = '_blank'
    // a.click()

    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    )
  }

  const handleOk = (data: any) => {
    console.log('lists', data)
    const _file = file

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
        files: createFile,
        images: [],
      },
    }
    console.log('modal', modal)
    // state set over here //

    onCancel(false)
  }

  useEffect(() => {
    if (file) {
      console.log('file useEffect', file)
      form.setFieldsValue({
        uploads: {
          files: file,
          imgages: [],
        },
      })
    }
  }, [file, form])

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
            <HiOutlineDocumentText /> แนบไฟล์เอกสาร
          </>
        }
        open={open}
        // onOk={handleOk}
        onCancel={() => onCancel(false)}
        // footer={<></>}
      >
        <Button
          onClick={() => {
            console.log('form.getFieldsValue()', form.getFieldsValue())
          }}
        >
          Check useForm
        </Button>
        <Title>{text}</Title>
        <label>{`อัปโหลดไฟล์เอกสาร (xlsx, docx, ptt, pdf)`}</label>
        {/* <Form name='validate_other' onFinish={handleOk}>
          <Form.Item name='dragger'>
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
          </Form.Item>
          <Row style={{ padding: 10 }}>
            <Col span={12}>
              <h3>อัพโหลดไฟล์</h3>
            </Col>
            <Col span={12} style={{ textAlign: 'end' }}>
              <Form.Item name='upload'>
                <Upload {...propsButton}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Upload {...propsUpload} listType='text' />
            </Col>
          </Row>
        </Form> */}

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

export default MatterDocsUpload

const Title = styled.h1`
  color: #00408e;
  font-size: 36px;
  font-weight: revert;
  margin-bottom: 0em;
`
