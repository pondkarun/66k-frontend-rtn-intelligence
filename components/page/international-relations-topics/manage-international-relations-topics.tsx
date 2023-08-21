import FormUpload from '@/components/shares/FormUpload';
import { Badge, Button, Col, DatePicker, Form, FormInstance, Input, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsImage } from "react-icons/bs";
import { Tforminternational } from '@/interface/international_relations_topics.interface';

type ManageInternationalRelationsTopicsType = {
    mode: "add" | "edit"
}

//#region -> styled
const Title = styled("h1")`
    color: #00408E;
    font-size: 36px;
    font-weight: revert;
    margin-bottom: 0em;
`
const SubTitle = styled("div")`
    font-size: 1.75rem;
    color: #565252;
`

const Line = styled("div")`
    height: 0px;
    border: 1px solid #D9D9D9;
    position: relative;
    margin: 2px 0px 10px 0px;
   
`

//#endregion

const ManageInternationalRelationsTopics = ({ mode }: ManageInternationalRelationsTopicsType) => {

    const { toppic_obj } = useSelector(({ toppic_menu }) => toppic_menu);
    const [form] = Form.useForm<Tforminternational>();

    useEffect(() => {
        form.setFieldsValue({
            file: [
                {
                    name: "excel.png",
                    url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                }
            ],
            image: [
                {
                    name: "image.png",
                    url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                }
            ],
        })
    }, [])

    const onFinish = () => {
        const data = form.getFieldsValue()
        console.log('data :>> ', data);
    }

    type SpecificFieldType = {
        groups: string;
        value: string[];
    }

    return (
        <>
            <Title>{mode == "add" ? "เพิ่ม" : "แก้ไข"}ข้อมูล {toppic_obj?.name}</Title>
            <SubTitle>พบข้อมูล : 2 รายการ</SubTitle>

            <SubTitle style={{ paddingTop: 20 }}>ข้อมูลทั่วไป</SubTitle>
            <Line />


            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item name="event_name" label="ชื่อกิจกรรม" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="event_venue" label="สถานที่จัดกิจกรรม">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="leader_name_thai" label="หัวหน้าคณะฝ่ายไทย">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="leader_name_foreign" label="หัวหน้าคณะฝ่ายต่างประเทศ">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="event_date" label="ห้วงเวลาเริ่มต้น - สิ้นสุด" rules={[{ required: true }]}>
                            <DatePicker.RangePicker format={"DD/MM/YYYY"} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <FormUpload form={form} type='file' name="file" />
                    </Col>

                    <Col span={12}>
                        <FormUpload form={form} type='image' name="image" />
                    </Col>
                </Row>

                {toppic_obj?.guide_line_specific_field?.map((e: SpecificFieldType) => (
                    <>
                        <SubTitle>{e.groups}</SubTitle>
                        <Line />

                        <Row gutter={[16, 0]}>
                            {e.value.map((item: string, index: number) => (
                                <Col span={12} key={item + index}>
                                    <Form.Item name={["specific_field", e.groups, item, "value"]} label={<LabelIconUpload label={item} form={form} name={["specific_field", e.groups, item]} />}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            ))}
                        </Row>

                    </>
                ))}


                <Button onClick={() => form.submit()}>บันทึก</Button>


            </Form>
        </>
    )
}

type IconUploadType = {
    label: string;
    form: any;
    name: string[];
}

const Icon = styled("span")`
    padding-left: 10px;
    cursor: pointer;
    .ant-badge-count {
        top: 17px;
        min-width: 15px;
        height: 15px;
        line-height: 15px;
    }
    svg {
        color: #00408E;
    }
`

const LabelIconUpload = ({ label, form, name }: IconUploadType) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState<"image" | "file" | null>(null);
    const [countFile, setCountFile] = useState<number>(0);
    const [countImage, setCountImage] = useState<number>(0);
    const [formUpload]: any = Form.useForm();

    const nameForm = name[name.length - 1];

    const onClick = (type: "image" | "file") => {
        setType(type)
        setIsModalOpen(true)
        setFormValue(type)
    }

    const handleOk = () => {
        setIsModalOpen(false);
        if (type) setFormValue(type)
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        if (type) setFormValue(type)
    };

    const setFormValue = (type: "image" | "file") => {
        // console.log('nameForm :>> ', nameForm);
        // console.log('name :>> ', name);
        const formName = form.getFieldValue(name);
        if (!formName) {
            form.setFieldValue(name, {
                upload: {
                    image: [],
                    file: [],
                }
            })
        }

        console.log(' formUpload.getFieldValue :>> ', formUpload.getFieldValue());
        const _nameForm = formUpload.getFieldValue(`${type}-${nameForm}`);
        console.log('_nameForm :>> ', _nameForm, `${type}-${nameForm}`);
        const setData = { ...formName };
        // console.log('setData :>> ', setData);

        if (type && setData) {
            if (!setData.upload) setData.upload = {
                image: [],
                file: [],
            }
            setData.upload[type] = _nameForm;
        }
        form.setFieldValue(name, setData)
        const _formName = form.getFieldValue(name);
        // console.log('_formName :>> ', _formName);

        if (_formName.upload) {
            setCountImage(_formName.upload.image?.length)
            setCountFile(_formName.upload.file?.length)
        }
    }

    return (
        <>
            <span>{label}</span>
            <Icon onClick={() => onClick("file")}><Badge count={countFile}><HiOutlineDocumentText /></Badge></Icon>
            <Icon onClick={() => onClick("image")}> <Badge count={countImage}><BsImage /></Badge></Icon>

            <Modal
                width={700}
                title={type == "file" ? <><HiOutlineDocumentText /> แนบไฟล์เอกสาร</> : <><BsImage /> แนบไฟล์ภาพ</>}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={<></>}
            >
                <Title>{label}</Title>

                {isModalOpen && nameForm ? type == "file" ? <FormUpload form={formUpload} type={"file"} name={`file-${nameForm}`} /> :
                    <FormUpload form={formUpload} type={"image"} name={`image-${nameForm}`} />
                    : null}
            </Modal>
        </>
    )
}

export default ManageInternationalRelationsTopics