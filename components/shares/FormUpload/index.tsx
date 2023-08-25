import { InboxOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Col, Modal, Row, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { RcFile } from 'antd/lib/upload'
import { useRouter } from 'next/router'
import getBase64 from '@/libs/getBase64'
import { internalUploadPublic } from '@/services/upload'
import type { FormInstance, UploadProps, UploadFile } from 'antd'

const { Dragger } = Upload

export type FormUploadType = {
  form: FormInstance
  type: 'file' | 'image'
  name: string
  acceptFile?: string
}

const FormUpload = ({ form, type, name, acceptFile }: FormUploadType) => {
  const [file, setFile] = useState<any>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const router = useRouter()
  const params = router.query

  const propsDragger: UploadProps = {
    name,
    multiple: true,
    action: '/api/upload',
    accept: acceptFile,
    onChange(info) {
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
    name,
    multiple: true,
    action: '/api/upload',
    accept: acceptFile,
    onChange: async (info) => {
      console.log('propsButton :>> ', info)

      internalUploadPublic({
        file: info.fileList as unknown as File,
        country_id: params.country as string,
        ticpid_id: params.toppic as string,
      })
      info.file.status = 'done'
      setFile([...file, ...info.fileList])
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
    onChange(info) {
      console.log('propsUpload :>> ', info)
      setFile(info.fileList)
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

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    )
  }

  useEffect(() => {
    form.setFieldsValue({
      [name]: file,
    })
  }, [file])

  useEffect(() => {
    const fileForm = form.getFieldValue(name)
    if (fileForm) {
      console.log('fileForm :>> ', fileForm)
      setFile(fileForm)
    }
  }, [])

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <div>
      <label>{`อัพโหลดไฟล์เอกสาร ${
        type == 'file' ? '(xlsx, doc, ptt, pdf)' : '(jpg, png, svg)'
      }`}</label>
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
          <Upload {...propsButton}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Col>
        <Col span={24}>
          {type == 'image' ? (
            <Upload {...propsUpload} listType={'picture-card'}>
              {uploadButton}
            </Upload>
          ) : (
            <Upload {...propsUpload} listType={'text'} />
          )}
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
          >
            <img alt='example' style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Col>
      </Row>
    </div>
  )
}

export default FormUpload
