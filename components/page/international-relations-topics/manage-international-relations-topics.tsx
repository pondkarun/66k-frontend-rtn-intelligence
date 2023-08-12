import FormUpload from '@/components/shares/FormUpload';
import { FormInterface } from '@/interface/formInstance.interface';
import { Button, Col, DatePicker, Form, FormInstance, Input, Row } from 'antd';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components';

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
    const [form]: FormInstance[] = Form.useForm();

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

    const onFinish = (value: any) => {
        // const data = form.getFieldValue()
        // console.log('data :>> ', data);
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

                <Button onClick={() => form.submit()}>บันทึก</Button>


            </Form>
        </>
    )
}

export default ManageInternationalRelationsTopics