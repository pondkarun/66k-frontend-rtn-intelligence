import Layout from '@/components/layout'
import { setBackground } from '@/redux/actions/configActions';
import { ColumnsType } from 'antd/es/table';
import { Button, Col, ConfigProvider, Form, Input, Modal, Popconfirm, Row, Select, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addIdentityUsersService, getByIdIdentityUsersService, searchIdentityUsersService, updateIdentityUsersService } from '@/services/identity_users';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { getAllDepartmentsService } from '@/services/departments';

//#region -> styled
const Title = styled("h1")`
    color: #00408E;
    font-size: 36px;
    font-weight: revert;
    margin-bottom: 0em;
`
const ButtonSearch = styled(Button)`
    height: 38px;
    margin-left: 10px;
    width: 100px;
    background-color: #00408e;
    color: #fff;
`

const Manage = styled("a")`
    padding-right: 5px;
`
const TableSearch = styled(Table)`
    border-radius: 16px 16px 0 0;
    th {
        background: #00408E !important;
        color: rgb(255 255 255) !important;
        text-align: center !important;
    }
`
//#endregion

const InternationalRelationsTopics = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formSearch] = Form.useForm();

    useEffect(() => {
        dispatch(setBackground("#fff"));
        getAllDepartments()
        searchData("")
    }, [])

    const searchData = async (search?: string) => {
        try {
            const res: any = await searchIdentityUsersService(search);
            setData(res.data?.data ?? [])
        } catch (error) {

        }
    }

    const getAllDepartments = async () => {
        try {
            const res: any = await getAllDepartmentsService();
            const data: any = [];
            if (res.data?.data) {
                res.data.data.forEach((e: any) => {
                    data.push({
                        value: e.id,
                        label: e.initials
                    })
                });
            }
            setDepartments(data)
        } catch (error) {

        }
    }

    const columns: any = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: 150,
        },
        {
            title: 'ชื่อ - สกุล',
            dataIndex: 'age',
            key: 'age',
            width: 200,
            render: (text: any, obj: any) => <>{obj.rank ? `${obj.rank} ` : ""}{obj.first_name} {obj.last_name}</>,
        },
        {
            title: 'หน่วยงาน',
            dataIndex: 'address',
            key: 'address',
            width: 200,
            render: (text: any, obj: any) => <>{obj.department?.initials}</>,
        },
        {
            title: 'ตำแหน่ง',
            dataIndex: 'position',
            key: 'position',
            width: 200,
        },
        {
            title: 'จัดการ',
            dataIndex: 'position',
            width: 110,
            align: 'center',
            render: (text: any, obj: any) => <>
                <Tooltip title={`ดูข้อมูล`}>
                    <Manage onClick={() => addEditViewModal("view", obj.id)}><EyeOutlined /></Manage>
                </Tooltip>

                <Tooltip title={`แก้ไขข้อมูล`}>
                    <Manage onClick={() => addEditViewModal("edit", obj.id)}><EditOutlined /></Manage>
                </Tooltip>

                <Tooltip title={`ลบข้อมูล`}>
                    <Popconfirm placement="top" title={"ยืนยันการลบข้อมูล"} onConfirm={() => console.log('Del :>> ')} okText="ตกลง" cancelText="ยกเลิก">
                        <Manage><DeleteOutlined /></Manage>
                    </Popconfirm>
                </Tooltip>
            </>,
        },
    ];

    const onFinishSearch = (value: any) => {
        console.log('Finish:', value);
        searchData(value.search)
    }

    /** Modal */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setIsMode] = useState("add");
    const [dataId, setIsDataId] = useState("");
    const [form] = Form.useForm();

    const addEditViewModal = async (mode: "add" | "edit" | "view", id?: string) => {
        setIsMode(mode)
        if (id) {
            setIsDataId(id)
            const callback: any = await getByIdIdentityUsersService(id);
            console.log('callback.data.data :>> ', callback.data.data);
            form.setFieldsValue(callback.data.data)
        }
        setIsModalOpen(true);
    }

    const handleOk = () => {
        form.submit()
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsMode("add");
        form.resetFields()
    };

    const onFinish = async (value: any) => {
        try {
            if (mode == "add") {
                await addIdentityUsersService(value)
            } else if (mode == "edit") {
                await updateIdentityUsersService(value, dataId)
            }

            handleCancel()
            searchData(formSearch.getFieldValue("search"))
        } catch (error) {

        }
    }

    const onFinishFailed = (error: any) => {
        console.log('error :>> ', error);
    }

    return (
        <Layout>
            <>
                <Title>หัวข้อความสัมพันธ์ระหว่างประเทศ</Title>

                <Row style={{ paddingTop: 10 }}>
                    <Col span={6}>
                        <Form form={formSearch} name="search_identity_users" layout="vertical" autoComplete="off" onFinish={onFinishSearch}>
                            <Form.Item name="search" >
                                <Input placeholder='ค้นหา' onKeyPress={event => {
                                    if (event.key === 'Enter') {
                                        formSearch.submit()
                                    }
                                }} allowClear />
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={6}>
                        <Form.Item>
                            <ButtonSearch onClick={() => formSearch.submit()}>ค้นหา</ButtonSearch>
                            <ButtonSearch onClick={() => setIsModalOpen(true)}><PlusCircleOutlined /> เพิ่ม</ButtonSearch>
                        </Form.Item>
                    </Col>
                </Row>

                <ConfigProvider theme={{
                    token: {
                        colorPrimary: "#00408E",
                    },
                }}>
                    <TableSearch rowKey={"id"} columns={columns} dataSource={data} scroll={{ x: "100%", y: "100%" }} />
                </ConfigProvider>

                <Modal width={600} title={`${mode == "add" ? "เพิ่ม" : mode == "edit" ? "แก้ไข" : "ดู"}ข้อมูลผู้ใช้งาน`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <Form
                        form={form}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true }]}
                        >
                            <Input disabled={mode == "add" ? false : true} />
                        </Form.Item>

                        <Form.Item
                            label="คำนำหน้า"
                            name="rank"
                        >
                            <Input disabled={mode == "view" ? true : false} />
                        </Form.Item>

                        <Form.Item
                            label="ชื่อจริง"
                            name="first_name"
                            rules={[{ required: true }]}
                        >
                            <Input disabled={mode == "view" ? true : false} />
                        </Form.Item>

                        <Form.Item
                            label="นามสกุล"
                            name="last_name"
                            rules={[{ required: true }]}
                        >
                            <Input disabled={mode == "view" ? true : false} />
                        </Form.Item>

                        <Form.Item
                            label="ตำแหน่ง"
                            name="position"
                            rules={[{ required: true }]}
                        >
                            <Input disabled={mode == "view" ? true : false} />
                        </Form.Item>

                        <Form.Item
                            label="หน่วยงาน"
                            name="department_id"
                            rules={[{ required: true }]}
                        >
                            <Select
                                showSearch
                                filterOption={(input, option: any) => (option?.label ?? '').includes(input)}
                                style={{ width: "100%" }}
                                options={departments}
                                disabled={mode == "view" ? true : false}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        </Layout >
    )
}

export default InternationalRelationsTopics;