import {
  InboxOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Button, Carousel, Col, Form, Modal, Row, Upload, message } from 'antd'
import {
  Fragment,
  Key,
  Ref,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { RcFile, UploadChangeParam } from 'antd/lib/upload'
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
  name: any
  acceptFile?: string
  randerList?: TdocumentsOption
  randerListHeader?: TdocumentsOption
  ticpidId?: string
  disabled?: boolean
  dir?: string
  hideCover?: boolean
}

const FormUpload = ({
  form,
  type,
  name,
  acceptFile,
  randerList,
  randerListHeader,
  ticpidId,
  disabled,
  dir,
  hideCover
}: FormUploadType) => {
  const [file, setFileData] = useState<any>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [isViewHeader, setIsViewHeader] = useState(false)
  const [fileType, setFileType] = useState<string | undefined>()
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  const slider = useRef<{ next: () => void; prev: () => void }>(null)

  const router = useRouter()
  const params = router.query

  const setFile = (value: any) => {
    setFileData(value)
    form.setFieldValue(name, value)
  }

  const beforeUploadValidateSize = (
    _info: UploadChangeParam<UploadFile<any>>,
    _type: 'file' | 'image',
  ) => {
    const unitFile = _type === 'file' ? 50 : 10
    const limitFile = Number(_info.file.size) / 1024 / 1024 < unitFile
    if (!limitFile) {
      message.error(
        `${_type === 'file' ? 'เอกสาร' : 'รูปภาพ'}มีขนาดเกิน ${unitFile}MB`,
      )
      return false
    }
    return true
  }

  const propsDragger: UploadProps = {
    name,
    multiple: true,
    action: '/api/upload',
    accept: acceptFile,
    onChange: async (info) => {
      // console.log('info :>> ', info);
      const isLimit = beforeUploadValidateSize(info, type)
      if (isLimit) {
        info.file.status = 'done'
        setFile([...file, ...info.fileList])
      } else {
        info.file.status = 'error'
        setFile([...file, ...info.fileList])
      }
    },
    fileList: [],
    onDrop(e) {
      // console.log('Dropped files', e.dataTransfer.files)
    },
  }
  const propsButton: UploadProps = {
    name,
    multiple: true,
    action: '/api/upload',
    accept: acceptFile,
    onChange: async (info) => {
      const isLimit = beforeUploadValidateSize(info, type)
      if (isLimit) {
        info.file.status = 'done'
        setFile([...file, ...info.fileList])
      } else {
        info.file.status = 'error'
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

    setFileType(file.type?.split('/')[1])
    setPreviewImage(file.url || (file.preview as string))
    if (type === 'file' && file.url) {
      const a = document.createElement('a')
      a.href = file.url
      a.target = '_blank'
      a.click()
    } else if (type === 'file' && file.preview) {
      const blob = new Blob([file.originFileObj as any], {
        type: 'application/pdf',
      })
      const urlBlob = URL.createObjectURL(blob)
      window.open(urlBlob, '_blank')
    } else setPreviewOpen(true)

    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    )
  }

  const checkWindowSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEffect(() => {
    setFileData([])
    const fileForm = form.getFieldValue(name)
    if (fileForm) {
      setFile(fileForm)
    }
  }, [name])

  useEffect(() => {
    const fileForm = form.getFieldValue(name)
    if (fileForm) {
      setFile(fileForm)
    }
  }, [])

  useEffect(() => {
    if (typeof randerList !== 'undefined') {
      setFile(randerList)
    }
    if (typeof randerListHeader !== 'undefined') {
      setImageUrl(randerListHeader)
      if (type === 'image') {
        form.setFieldValue('file_image_header', randerListHeader)
      }
    }
  }, [randerList, randerListHeader])

  useEffect(() => {
    checkWindowSize()
  }, [])

  const [imageUrl, setImageUrl] = useState<any>([])

  const handleChange: UploadProps['onChange'] = async (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.fileList.length > 0) {
      const isLimit = beforeUploadValidateSize(info, type)
      if (isLimit) {
        info.file.status = 'done'
        setImageUrl([...info.fileList])
        form.setFieldValue('file_image_header', info.fileList)
      } else {
        info.file.status = 'error'
        setImageUrl([])
      }
    } else {
      setImageUrl([...info.fileList])
      form.setFieldValue('file_image_header', [])
    }
  }

  const ContentShowImage = (props: any) => {
    const { items } = props
    useEffect(() => {
      items.forEach((element: any) => handlePreview(element))
    }, [items])
    return (
      <>
        <Carousel effect='fade' ref={slider as any}>
          {items.map(
            (list: {
              uid: Key
              name: string
              url: string
              preview?: string
            }) => {
              return (
                <Fragment key={list.uid}>
                  <img
                    alt={list.name}
                    style={{ width: '100%', height: '700px' }}
                    src={list.url ? list.url : list.preview}
                  />
                </Fragment>
              )
            },
          )}
        </Carousel>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={() => slider.current?.prev()}
            type='text'
            icon={<LeftOutlined />}
          />
          <Button
            onClick={() => slider.current?.next()}
            type='text'
            icon={<RightOutlined />}
          />
        </div>
      </>
    )
  }

  return (
    <div>
      <label>{`อัปโหลดไฟล์${type == 'image' ? 'รูปภาพ' : 'เอกสาร'} ${type == 'file' ? '(xlsx, docx, ptt, pdf)' : '(jpg, png, svg)'
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
            <Col xs={10} span={12}>
              {type == 'image' ? (
                <h3>อัปโหลดรูปภาพ</h3>
              ) : (
                <h3>อัปโหลดไฟล์เอกสาร</h3>
              )}
            </Col>
            <Col xs={14} span={12} style={{ textAlign: 'end' }}>
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
            <div style={{ display: 'inline-flex' }}>
              {!hideCover ?
                <Upload
                  disabled={disabled}
                  className='custom-upload'
                  name={`file_image_header`}
                  listType='picture-card'
                  accept={acceptFile}
                  action='/api/upload'
                  onChange={handleChange}
                  fileList={imageUrl}
                  onPreview={(e) => handlePreview(e)}
                >
                  {imageUrl.length === 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <PlusOutlined />
                      <span>อัปโหลดรูปปก</span>
                    </div>
                  ) : null}
                </Upload> : null}
              <Upload
                disabled={disabled}
                {...propsUpload}
                listType={'picture-card'}
              />
            </div>
          ) : (
            <Upload disabled={disabled} {...propsUpload} listType={'text'} />
          )}
        </Col>
      </Row>

      <Modal
        open={previewOpen}
        title={null}
        footer={null}
        width={700}
        onCancel={() => setPreviewOpen(false)}
      >
        {imageUrl.length > 0 || file.length > 0 ? (
          <ContentShowImage items={[...imageUrl, ...file]} />
        ) : null}
      </Modal>
    </div>
  )
}

export default FormUpload
