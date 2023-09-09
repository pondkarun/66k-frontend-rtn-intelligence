import { Button, Col, ConfigProvider, Form, Input, Modal, Popconfirm, Result, Row, Select, Table, Tooltip, TreeSelect } from 'antd';
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { addIdentityUsersService, getByIdIdentityUsersService, searchIdentityUsersService, updateIdentityUsersService } from '@/services/identity_users';
import { setBackground } from '@/redux/actions/configActions';
import Layout from '@/components/layout'
import { getAllDepartmentsService } from '@/services/departments';
import type { ColumnsType } from 'antd/es/table';

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

const IdentityUsers = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formSearch] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();

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
            modal.error({
                centered: true,
                content: "มีบางอย่างพิดพลาด",
            });
        }
    }

    function buildTree(data: any) {
        const idMap = new Map();
        const resTree: any = [];

        data.forEach((item: any) => {
            idMap.set(item.id, { ...item, children: [] });
        });

        idMap.forEach((item, id) => {
            if (item.parent_id === null) {
                resTree.push(item);
            } else {
                const parent = idMap.get(item.parent_id);
                parent.children.push(item);
            }
        });

        return resTree;
    }

    const getAllDepartments = async () => {
        try {
            const res: any = await getAllDepartmentsService();
            let data: any = [];
            if (res.data?.data) {
                const map_data = res.data.data.map((e: any) => {
                    return {
                        id: e.id,
                        value: e.id,
                        title: e.initials,
                        parent_id: e.parent_id
                    }
                });
                data = buildTree(map_data);
            }
            setDepartments(data)
        } catch (error) { /* empty */ }
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


                {obj.username !== "superadmin" ? <>
                    <Tooltip title={`แก้ไขข้อมูล`}>
                        <Manage onClick={() => addEditViewModal("edit", obj.id)}><EditOutlined /></Manage>
                    </Tooltip>

                    <Tooltip title={`ลบข้อมูล`}>
                        <Popconfirm placement="top" title={"ยืนยันการลบข้อมูล"} onConfirm={() => delData(obj.id)} okText="ตกลง" cancelText="ยกเลิก">
                            <Manage><DeleteOutlined /></Manage>
                        </Popconfirm>
                    </Tooltip></>
                    : null}


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
            form.setFieldsValue(callback.data.data)
        }
        setIsModalOpen(true);
    }

    const delData = async (id: string) => {
        try {
            await updateIdentityUsersService({
                is_use: false,
                is_active: false,
            }, id)
            modal.success({
                centered: true,
                content: 'บันทึกสำเร็จ',
            });
            handleCancel()
            searchData(formSearch.getFieldValue("search"))
        } catch (error) {
            modal.error({
                centered: true,
                content: "มีบางอย่างพิดพลาด",
            });
        }
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
            let isError = false, textError = null;
            if (mode == "add") {
                const callback: any = await addIdentityUsersService(value);
                isError = callback.data.error ? true : false;
                textError = isError ? callback.data.error : null;
            } else if (mode == "edit") {
                await updateIdentityUsersService(value, dataId)
            }
            if (isError) {
                modal.error({
                    centered: true,
                    content: textError
                });
            } else {
                if (mode != "view") {
                    modal.success({
                        centered: true,
                        content: 'บันทึกสำเร็จ',
                    });
                    await searchData(formSearch.getFieldValue("search"))
                }
                handleCancel()
            }
        } catch (error) {
            modal.error({
                centered: true,
                content: "มีบางอย่างพิดพลาด",
            });
        }
    }

    const onFinishFailed = (error: any) => {
        console.log('error :>> ', error);
    }

    return (
        <Layout>
            <>
                <Title>ผู้ใช้งาน</Title>

                <Row style={{ paddingTop: 10 }}>
                    <Col xs={24} md={6} span={6}>
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
                    <Col xs={24} md={12} span={6}>
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
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                allowClear
                                treeDefaultExpandAll
                                treeData={departments}
                                filterTreeNode={(input: any, option: any) => (option?.title ?? '').includes(input)}
                                disabled={mode == "view" ? true : false}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                {contextHolder}
            </>
        </Layout >
    )
}

export default IdentityUsers