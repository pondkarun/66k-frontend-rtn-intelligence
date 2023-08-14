import getBase64 from '@/libs/getBase64';
import { InboxOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormInstance, Modal, Row, Upload, UploadFile, UploadProps, message } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useEffect, useState } from 'react';
const { Dragger } = Upload;

export type FormUploadType = {
    form: FormInstance;
    type: "file" | "image";
    name: string;
}

const FormUpload = ({ form, type, name }: FormUploadType) => {
    const [file, setFile] = useState<any>([])
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const propsDragger: UploadProps = {
        name,
        multiple: true,
        action: '/api/upload',
        onChange(info) {
            // console.log('info :>> ', info);
            info.file.status = "done";
            setFile([...file, ...info.fileList])
        },
        fileList: [],
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    const propsButton: UploadProps = {
        name,
        multiple: true,
        action: '/api/upload',
        onChange(info) {
            // console.log('info :>> ', info);
            info.file.status = "done";
            setFile([...file, ...info.fileList])
        },
        fileList: [],
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    const propsUpload: UploadProps = {
        name,
        multiple: true,
        action: '/api/upload',
        onChange(info) {
            // console.log('info :>> ', info);
            setFile(info.fileList)
        },
        fileList: file,
        onPreview(e) {
            handlePreview(e)
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    useEffect(() => {
        form.setFieldsValue({
            [name]: file
        })
    }, [file])

    useEffect(() => {
        const fileForm = form.getFieldValue(name);
        if (fileForm) {
            setFile(fileForm)
        }
    }, [])


    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div>
            <label>{`อัพโหลดไฟล์เอกสาร ${type == "file" ? "(xlsx, doc, ptt, pdf)" : "(jpg, png, svg)"}`}</label>
            <Dragger {...propsDragger}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">คลิกหรือลากไฟล์ไปยังพื้นที่นี้ เพื่ออัปโหลด</p>
                <p className="ant-upload-hint">
                    สนับสนุนสำหรับการอัปโหลดครั้งเดียวหรือจำนวนมาก
                </p>
            </Dragger>
            <Row style={{ padding: 10 }}>
                <Col span={12}><h3>อัพโหลดไฟล์</h3></Col>
                <Col span={12} style={{ textAlign: "end" }}>
                    <Upload {...propsButton}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Col>
                <Col span={24}>
                    {type == "image" ?
                        <Upload {...propsUpload} listType={"picture-card"} >
                            {uploadButton}
                        </Upload> :
                        <Upload {...propsUpload} listType={"text"} />
                    }
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </Col>
            </Row>

        </div >

    )
}

export default FormUpload