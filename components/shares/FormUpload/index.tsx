import { InboxOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Col, Form, Modal, Row, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { RcFile } from 'antd/lib/upload'
import { useRouter } from 'next/router'
import getBase64 from '@/libs/getBase64'
import {
  internalUploadPublicService,
  removeInternalUploadPublicService,
} from '@/services/upload'
import {
  TdocumentsOption,
  Tforminternational,
} from '@/interface/international_relations_datas.interface'
import type { FormInstance, UploadProps, UploadFile } from 'antd'

const { Dragger } = Upload

export type FormUploadType = {
  form: FormInstance<Tforminternational>
  type: 'file' | 'image'
  name: string
  acceptFile?: string
  randerList?: TdocumentsOption
  ticpidId?: string
  disabled?: boolean
}

const FormUpload = ({
  form,
  type,
  name,
  acceptFile,
  randerList,
  ticpidId,
  disabled,
}: FormUploadType) => {
  const [file, setFile] = useState<any>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileType, setFileType] = useState<string | undefined>()

  const router = useRouter()
  const params = router.query

  const propsDragger: UploadProps = {
    name,
    multiple: true,
    action: '/api/upload',
    accept: acceptFile,
    onChange: async (info) => {
      // console.log('info :>> ', info);
      const fileUploaded = await internalUploadPublicService({
        formData: info.fileList,
        country_id: params.country as string,
        ticpid_id: params.toppic
          ? (params.toppic as string)
          : (ticpidId as string),
      })

      if (fileUploaded === 'OK') {
        info.file.status = 'done'
        setFile([...file, ...info.fileList])
      }
    },
    fileList: [],
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }
  const propsButton: UploadProps = {
    name,
    multiple: true,
    action: '/api/upload',
    accept: acceptFile,
    onChange: async (info) => {
      // console.log('propsButton :>> ', info)
      const fileUploaded = await internalUploadPublicService({
        formData: info.fileList,
        country_id: params.country as string,
        ticpid_id: params.toppic
          ? (params.toppic as string)
          : (ticpidId as string),
      })

      if (fileUploaded === 'OK') {
        info.file.status = 'done'
        setFile([...file, ...info.fileList])
      }
    },
    fileList: [],
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }
  const propsUpload: UploadProps = {
    name,
    multiple: true,
    accept: acceptFile,
    action: '/api/upload',
    onChange: (info) => {
      try {
        removeInternalUploadPublicService({
          country_id: params.country as string,
          ticpid_id: params.toppic
            ? (params.toppic as string)
            : (ticpidId as string),
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

  useEffect(() => {
    console.log('name : useEffect', name)
    form.setFieldsValue({
      [name]: file,
    })
  }, [file, name])

  useEffect(() => {
    const fileForm = form.getFieldValue(name)
    if (fileForm) {
      // console.log('fileForm :>> ', fileForm)
      setFile(fileForm)
    }
  }, [])

  useEffect(() => {
    if (typeof randerList !== 'undefined') {
      setFile(randerList)
    }
  }, [randerList])

  const uploadButton = (
    <>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </>
  )

  return (
    <div>
      <label>{`อัพโหลดไฟล์เอกสาร ${
        type == 'file' ? '(xlsx, doc, ptt, pdf)' : '(jpg, png, svg)'
      }`}</label>
      {!disabled && (
        <Form.Item name={name}>
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
      )}
      <Row style={{ padding: 10 }}>
        {!disabled && (
          <>
            <Col span={12}>
              <h3>อัพโหลดไฟล์</h3>
            </Col>
            <Col span={12} style={{ textAlign: 'end' }}>
              <Form.Item name={name}>
                <Upload disabled={disabled} {...propsButton}>
                  <Button disabled={disabled} icon={<UploadOutlined />}>
                    Click to Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={24}>
          {type == 'image' ? (
            <Upload
              disabled={disabled}
              {...propsUpload}
              listType={'picture-card'}
            />
          ) : (
            <Upload disabled={disabled} {...propsUpload} listType={'text'} />
          )}
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
          >
            {fileType === 'pdf' ? (
              <iframe
                style={{ width: '100%', height: '100%', minHeight: '400px' }}
                src={previewImage}
              />
            ) : (
              <img alt='example' style={{ width: '100%' }} src={previewImage} />
            )}
          </Modal>
        </Col>
      </Row>
    </div>
  )
}

export default FormUpload
