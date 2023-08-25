import { Badge, Button, Col, ConfigProvider, Form, Input, Modal, Popconfirm, Result, Row, Select, Space, Table, Tooltip, TreeSelect } from 'antd';
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { DeleteOutlined, EditOutlined, EyeOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { setBackground } from '@/redux/actions/configActions';
import Layout from '@/components/layout'
import { addInternationalRelationsTopicsService, getByIDInternationalRelationsTopicsService, internationalRelationsTopicsService, searchInternationalRelationsTopicsService, updateInternationalRelationsTopicsService } from '@/services/internationalRelationsTopics';

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
//#endregion

const InternationalRelationsTopics = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [topics, setTopics] = useState([]);
    const [formSearch] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();

    useEffect(() => {
        dispatch(setBackground("#fff"));
        getAllTopics()
        searchData("")
    }, [])

    const searchData = async (search?: string) => {
        try {
            const res: any = await searchInternationalRelationsTopicsService(search);
            setData(res.data?.data ?? [])
        } catch (error) {
            modal.error({
                centered: true,
                content: "มีบางอย่างพิดพลาด",
            });
        }
    }

    const getAllTopics = async () => {
        try {
            const res: any = await internationalRelationsTopicsService();
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
            setTopics(data)
        } catch (error) { /* empty */ }
    }

    const columns: any = [
        {
            title: 'หัวข้อ',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        },
        {
            title: 'Specific',
            dataIndex: 'guide_line_specific_field',
            key: 'guide_line_specific_field',
            width: 80,
            align: 'center',
            render: (text: any, obj: any) => <Badge color={!text ? "red" : "green"} />,
        },
        {
            title: 'หัวข้อแม่',
            dataIndex: 'parent',
            key: 'parent',
            width: 200,
            render: (text: any, obj: any) => <>{text ? text.name : "-"}</>,
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
            const callback: any = await getByIDInternationalRelationsTopicsService(id);
            form.setFieldsValue(callback.data)
        }
        setIsModalOpen(true);
    }

    const delData = async (id: string) => {
        try {
            await updateInternationalRelationsTopicsService({
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
            // console.log('value :>> ', value);
            let isError = false, textError = null;
            if (mode == "add") {
                const callback: any = await addInternationalRelationsTopicsService(value);
                isError = callback.data.error ? true : false;
                textError = isError ? callback.data.error : null;
            } else if (mode == "edit") {
                await updateInternationalRelationsTopicsService(value, dataId)
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

                <Modal width={700} title={`${mode == "add" ? "เพิ่ม" : mode == "edit" ? "แก้ไข" : "ดู"}ข้อมูลผู้ใช้งาน`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <Form
                        form={form}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 21 }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >

                        <Form.Item
                            label="หัวข้อแม่"
                            name="parent_id"
                        >
                            <TreeSelect
                                showSearch
                                style={{ width: '85%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                allowClear
                                treeDefaultExpandAll
                                treeData={topics}
                                disabled={mode == "view" ? true : false}
                            />
                        </Form.Item>

                        <Form.Item
                            label="หัวข้อ"
                            name="name"
                            rules={[{ required: true }]}
                        >
                            <Input disabled={mode == "view" ? true : false} style={{ width: "85%" }} />
                        </Form.Item>

                        <TitleText>Specific</TitleText>

                        <Form.List name="guide_line_specific_field">
                            {(fields, { add, remove }) => (
                                <div style={{ paddingTop: 25, paddingLeft: 80 }}>
                                    {fields.map((field) => (
                                        <Space key={field.key} align="baseline">
                                            <Form.Item
                                                // noStyle
                                                shouldUpdate={(prevValues, curValues) =>
                                                    prevValues.groups !== curValues.groups || prevValues.value !== curValues.value
                                                }
                                            >
                                                {() => (
                                                    <Form.Item
                                                        {...field}
                                                        label="Groups"
                                                        name={[field.name, 'groups']}
                                                        rules={[{ required: true, message: 'Missing groups name' }]}
                                                    >
                                                        <Input style={{ width: 180 }} disabled={mode == "view" ? true : false} />
                                                    </Form.Item>
                                                )}
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'value']}
                                                rules={[{ required: true, message: 'Missing value' }]}
                                            >

                                                <Select
                                                    mode="tags"
                                                    style={{ width: 240 }}
                                                    options={[]}
                                                    disabled={mode == "view" ? true : false}
                                                />
                                            </Form.Item>

                                            {mode !== "view" ? <MinusCircleOutlined onClick={() => remove(field.name)} /> : null}
                                        </Space>
                                    ))}
                                    {mode !== "view" ? <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            เพิ่ม
                                        </Button>
                                    </Form.Item> : null}

                                </div>
                            )}
                        </Form.List>

                    </Form>
                </Modal>
                {contextHolder}
            </>
        </Layout >
    )
}

export default InternationalRelationsTopics