import { Button, Col, ConfigProvider, Form, Input, Modal, Popconfirm, Row, Table, Tooltip, Tree, TreeSelect } from 'antd';
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { DeleteOutlined, EditOutlined, EyeOutlined, PartitionOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { setBackground } from '@/redux/actions/configActions';
import Layout from '@/components/layout'
import { internationalRelationsTopicsService } from '@/services/internationalRelationsTopics';
import { addDepartmentsService, getAllDepartmentsListService, getAllDepartmentsService, getByIDDepartmentsService, updateDepartmentsService } from '@/services/departments';
import ModalFooter from '@/components/shares/ModalFooter';
import trimDataString from '@/libs/trimFormDataString';
import { isArray } from 'lodash';

const { SHOW_PARENT } = TreeSelect;
const Departments = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [topicsTreeData, setTopicsTreeData] = useState([]);
    const [departmentsAll, setDepartmentsAll] = useState([]);
    const [formSearch] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();

    useEffect(() => {
        init()
    }, [])

    const init = () => {
        dispatch(setBackground("#fff"));
        getAllTopics()
        getAllDepartment()
        searchData("")
    }

    const searchData = async (search?: string) => {
        try {
            const res: any = await getAllDepartmentsService(search);
            setData(res.data?.data ?? [])
        } catch (error) {
            modal.error({
                centered: true,
                content: "มีบางอย่างพิดพลาด",
            });
        }
    }

    const getAllDepartment = async () => {
        try {
            const res: any = await getAllDepartmentsListService();
            let data: any = [];
            if (res.data?.data) {
                const setData = (arr: any) => {
                    arr.forEach((e: any) => {
                        e.value = e.id;
                        e.title = e.name;
                        setData(e.children)
                    });
                }
                setData(res.data.data)
                data = res.data.data
            }
            setDepartmentsAll(data)
        } catch (error) { /* empty */ }
    }

    const getAllTopics = async () => {
        try {
            const res: any = await internationalRelationsTopicsService();
            let data: any = [];
            if (res.data?.data) {
                const _res = res.data?.data;
                /* setTopics */
                const setData = (arr: any) => {
                    arr?.forEach((e: any) => {
                        e.key = e.id;
                        e.value = e.id;
                        e.label = e.name;
                        e.title = e.name;
                        setData(e.children)
                    });
                }
                setData(_res)
                data = _res
            }
            setTopicsTreeData(data)
        } catch (error) {
            console.log('error :>> ', error);
        }
    }

    const columns: any = [
        {
            title: 'หน่วยงาน',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        },
        {
            title: 'หน่วยงานย่อ',
            dataIndex: 'initials',
            key: 'initials',
            width: 150,
        },
        {
            title: 'หน่วยงานแม่',
            dataIndex: 'parent',
            key: 'parent',
            width: 200,
            render: (text: any, obj: any) => <>{text ? text.name : "-"}</>,
        },
        {
            title: 'Permission หัวข้อ',
            dataIndex: 'permission_ir_topics',
            key: 'permission_ir_topics',
            width: 100,
            align: 'center',
            render: (text: any, obj: any) => <>{obj.permission_ir_topics ? obj.permission_ir_topics.length : "0"}</>,
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

                    {!(obj.permission_ir_topics?.length > 0) ?
                        <Tooltip title={`ลบข้อมูล`}>
                            <Popconfirm placement="top" title={"ยืนยันการลบข้อมูล"} onConfirm={() => delData(obj.id)} okText="ตกลง" cancelText="ยกเลิก">
                                <Manage><DeleteOutlined /></Manage>
                            </Popconfirm>
                        </Tooltip>
                        : null}
                </>
                    : null}
            </>,
        },
    ];

    const onFinishSearch = (value: any) => {
        searchData(value.search)
    }

    /** Modal */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalTreeOpen, setIsModalTreeOpen] = useState(false);
    const [mode, setIsMode] = useState("add");
    const [dataId, setIsDataId] = useState("");
    const [form] = Form.useForm();

    const addEditViewModal = async (mode: "add" | "edit" | "view", id?: string) => {
        setIsMode(mode)
        if (id) {
            setIsDataId(id)
            const callback: any = await getByIDDepartmentsService(id);
            callback.data.data.permission_ir_topics = callback.data.data.permission_ir_topics ?? []
            form.setFieldsValue(callback.data.data)
        }
        setIsModalOpen(true);
    }

    const delData = async (id: string) => {
        try {
            await updateDepartmentsService({
                is_use: false,
                is_active: false,
            }, id)
            modal.success({
                centered: true,
                content: 'ลบข้อมูลสำเร็จ',
            });
            dispatch(setBackground("#fff"));
            getAllTopics()
            getAllDepartment()
            searchData(formSearch.getFieldValue("search"))
        } catch (error) {
            modal.error({
                centered: true,
                content: "มีบางอย่างพิดพลาด",
            });
        }
    }

    const handleOk = () => {
        trimDataString(form);
        form.submit()
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsMode("add");
        form.resetFields()
    };

    const handleFinish = () => {
        setIsModalOpen(false);
        setIsMode("add");
        form.resetFields()
        init()
    };

    const onFinish = async (value: any) => {
        try {
            // console.log('value :>> ', value);
            let isError = false, textError = null;
            if (mode == "add") {
                const callback: any = await addDepartmentsService(value);
                isError = callback.data.error ? true : false;
                textError = isError ? callback.data.error : null;
            } else if (mode == "edit") {
                await updateDepartmentsService(value, dataId)
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
                    await getAllTopics()
                    handleFinish()
                } else {
                    handleCancel()
                }
            }
        } catch (error: any) {
            console.log('eror.response? :>> ', error.response?.data);
            if (isArray(error.response?.data)) {
                modal.error({
                    centered: true,
                    content: error.response?.data[0]?.error?.message ?? "มีบางอย่างพิดพลาด",
                });
            } else
                modal.error({
                    centered: true,
                    content: "มีบางอย่างพิดพลาด",
                });
        }
    }

    const onFinishFailed = (error: any) => {
        console.log('error :>> ', error);
    }

    const tProps = {
        treeData: topicsTreeData,
        // treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        placeholder: 'Please select',
        style: {
            width: '85%'
        },
        showLine: true,
        multiple: true,
        treeDefaultExpandAll: true,
        allowClear: true,
        maxTagTextLength: 20,
        maxTagCount: 5
    };

    return (
        <Layout>
            <>
                <Title>หน่วยงาน</Title>

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
                            <ButtonSearch onClick={() => setIsModalTreeOpen(true)}><PartitionOutlined /> Tree</ButtonSearch>
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

                <Modal
                    width={700}
                    title={``}
                    open={isModalTreeOpen}
                    onCancel={() => setIsModalTreeOpen(!isModalTreeOpen)}
                    footer={<div />}
                >

                    <TreeDisabled
                        showLine
                        treeData={topicsTreeData}
                        disabled
                    />
                </Modal>

                <Modal
                    width={700}
                    title={`${mode == "add" ? "เพิ่ม" : mode == "edit" ? "แก้ไข" : "ดู"}ข้อมูลผู้ใช้งาน`}
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={<ModalFooter mode={mode} onOk={handleOk} onCancel={handleCancel} />}
                >
                    <Form
                        form={form}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 21 }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >

                        <Form.Item
                            label="หน่วยงานแม่"
                            name="parent_id"
                        >
                            <TreeSelect
                                showSearch
                                style={{ width: '85%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                allowClear
                                treeDefaultExpandAll
                                treeData={departmentsAll}
                                filterTreeNode={(input: any, option: any) => (option?.title ?? '').includes(input)}
                                disabled={mode == "view"}
                            />
                        </Form.Item>

                        <Form.Item
                            label="หน่วยงาน"
                            name="name"
                            rules={[{ required: true }]}
                        >
                            <Input disabled={mode == "view" ? true : false} style={{ width: "85%" }} />
                        </Form.Item>

                        <Form.Item
                            label="หน่วยงานย่อ"
                            name="initials"
                            rules={[{ required: true }]}
                        >
                            <Input disabled={mode == "view" ? true : false} style={{ width: "85%" }} />
                        </Form.Item>

                        <TitleText>Permission Topics</TitleText>

                        <Form.Item
                            label="หัวข้อ"
                            name="permission_ir_topics"
                            style={{ paddingTop: 20 }}
                        >
                            <TreeSelect {...tProps} />
                        </Form.Item>

                    </Form>
                </Modal>
                {contextHolder}
            </>
        </Layout >
    )
}

//#region -> styled
const Title = styled("h1")`
    color: #00408E;
    font-size: 36px;
    font-weight: revert;
    margin-bottom: 0em;
`
const TitleText = styled("h3")`
    color: #00408E;
    font-size: 26px;
    font-weight: revert;
    margin-bottom: 0em;
    color: #000;
    border-bottom: 1px solid #000;
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
const TreeDisabled = styled(Tree)`
    .ant-tree-treenode-disabled .ant-tree-node-content-wrapper {
        color: rgb(0 0 0) !important;
        cursor: auto !important;
    }
`
//#endregion

export default Departments