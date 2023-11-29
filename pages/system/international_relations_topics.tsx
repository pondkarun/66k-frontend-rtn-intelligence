import { Badge, Button, Card, Col, ConfigProvider, Form, Input, Modal, Popconfirm, Result, Row, Select, Space, Table, Tooltip, Tree, TreeSelect, Typography } from 'antd';
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, MinusCircleOutlined, PartitionOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { setBackground } from '@/redux/actions/configActions';
import Layout from '@/components/layout'
import { addInternationalRelationsTopicsService, getByIDInternationalRelationsTopicsService, internationalRelationsTopicAllsService, internationalRelationsTopicsService, searchInternationalRelationsTopicsService, updateInternationalRelationsTopicsService } from '@/services/internationalRelationsTopics';
import ModalFooter from '@/components/shares/ModalFooter';
import trimDataString from '@/libs/trimFormDataString';
import { FormInstance } from 'antd/lib';

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
const SpaceForm = styled(Space)`
    align-items: start !important;
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

    const loadMasterData = () => {
        getAllTopics()
    }



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

    const getAllTopics = async (id?: string) => {
        try {
            const res: any = await internationalRelationsTopicAllsService();
            let data: any = [];
            if (res.data?.data) {
                const setData = (arr: any) => {
                    if (id) {
                        const index = arr.findIndex((w: any) => w.id == id)
                        if (index != -1) arr.splice(index, 1);
                    }
                    arr.forEach((e: any) => {
                        e.key = e.id;
                        e.value = e.id;
                        e.label = e.name + " " + `${e.last_node ? "(T)" : "(F)"}`;
                        e.title = e.name + " " + `${e.last_node ? "(T)" : "(F)"}`;
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
            title: 'หัวข้อแม่',
            dataIndex: 'parent',
            key: 'parent',
            width: 200,
            render: (text: any, obj: any) => <>{text ? text.name : "-"}</>,
        },
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
            title: 'เรียงลำดับ',
            dataIndex: 'sort',
            key: 'sort',
            width: 80,
            align: 'center',
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

                {!(obj.international?.length > 0) ?
                    <Tooltip title={`ลบข้อมูล`}>
                        <Popconfirm placement="top" title={"ยืนยันการลบข้อมูล"} onConfirm={() => delData(obj.id)} okText="ตกลง" cancelText="ยกเลิก">
                            <Manage><DeleteOutlined /></Manage>
                        </Popconfirm>
                    </Tooltip>
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
            const callback: any = await getByIDInternationalRelationsTopicsService(id);

            /* new */
            if (callback.data) {
                callback.data.guide_line_specific_field?.forEach((e: any) => {
                    const _value: any = []
                    e.value.forEach((value: any, index: number) => {
                        _value.push({
                            value,
                            detail: e.detail ? e.detail[index] ?? null : null
                        })
                    });
                    e.value = _value
                });
            }
            getAllTopics(id)
            form.setFieldsValue(callback.data)
        } else {
            getAllTopics()
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
                content: 'ลบข้อมูลสำเร็จ',
            });
            handleCancel()
            loadMasterData()
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

    const onFinish = async (_value: any) => {
        console.log('_value', _value)
        // try {
        //     /* new */
        //     const value = {
        //         ..._value,
        //         parent_id: _value.parent_id ?? null,
        //     }
        //     value.guide_line_specific_field?.forEach((e: any) => {
        //         const _value: any = [], _detail: any = [];
        //         e.value?.forEach((i: any) => {
        //             _value.push(i.value)
        //             _detail.push(i.detail)
        //         });
        //         e.value = _value;
        //         e.detail = _detail;
        //     });

        //     let isError = false, textError = null;
        //     if (mode == "add") {
        //         const callback: any = await addInternationalRelationsTopicsService(value);
        //         isError = callback.data.error ? true : false;
        //         textError = isError ? callback.data.error : null;
        //     } else if (mode == "edit") {
        //         await updateInternationalRelationsTopicsService(value, dataId)
        //     }
        //     if (isError) {
        //         modal.error({
        //             centered: true,
        //             content: textError
        //         });
        //     } else {
        //         if (mode != "view") {
        //             modal.success({
        //                 centered: true,
        //                 content: 'บันทึกสำเร็จ',
        //             });
        //             await searchData(formSearch.getFieldValue("search"))
        //             await getAllTopics()
        //         }
        //         handleCancel()
        //         loadMasterData()
        //     }
        // } catch (error) {
        //     console.log('error :>> ', error);
        //     modal.error({
        //         centered: true,
        //         content: "มีบางอย่างพิดพลาด",
        //     });
        // }
    }

    const onFinishFailed = (error: any) => {
        console.log('error :>> ', error);
    }

    return (
        <Layout>
            <>
                <Title>หัวข้อความสัมพันธ์ระหว่างประเทศ</Title>

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
                        treeData={topics}
                        disabled
                    />
                </Modal>
                <Modal
                    width={800}
                    title={`${mode == "add" ? "เพิ่ม" : mode == "edit" ? "แก้ไข" : "ดู"}ข้อมูลความสัมพันธ์ระหว่างประเทศ`}
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
                                filterTreeNode={(input: any, option: any) => (option?.title ?? '').includes(input)}
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

                        <Form.Item
                            label="เรียงลำดับ"
                            name="sort"
                        >
                            <Input type='number' disabled={mode == "view" ? true : false} style={{ width: "85%" }} />
                        </Form.Item>


                        <Specifics form={form} mode={mode} />
                        {/* <TitleText>Specific</TitleText>

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
                        </Form.List> */}

                    </Form>
                </Modal>
                {contextHolder}
            </>
        </Layout >
    )
}

const Specifics = ({ form, mode }: { form: FormInstance<any>; mode?: string }) => {

    const demo = {
        "parent_id": "03181e63-f06f-4dce-a8e8-f318ec959109",
        "name": "ความร่วมมือระดับประเทศ",
        "guide_line_specific_field": [
            {
                "groups": "ระดับประเทศ",
                "value": [
                    "การข่าว",
                    "การเมือง"
                ]
            }
        ]
    }
    return (
        <>
            <TitleText>Specific</TitleText>
            <Form.List name="guide_line_specific_field">
                {(fields, { add, remove }) => (
                    <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column', paddingTop: 10 }}>
                        {fields.map((field) => (
                            <Card
                                size="small"
                                title={`Groups ${field.name + 1}`}
                                key={field.key}
                                extra={
                                    mode != "view" ? <CloseOutlined
                                        onClick={() => {
                                            remove(field.name);
                                        }}
                                    /> : null
                                }
                            >
                                <Form.Item label="Groups" name={[field.name, 'groups']} rules={[{ required: true, message: 'Missing groups name' }]}>
                                    <Input disabled={mode == "view" ? true : false} />
                                </Form.Item>

                                <Form.Item label="Suggestion" name={[field.name, 'suggestion']}>
                                    <Input.TextArea disabled={mode == "view" ? true : false} />
                                </Form.Item>

                                {/* Nest Form.List */}
                                <Form.Item label="Value">
                                    <Form.List name={[field.name, 'value']}>
                                        {(subFields, subOpt) => (
                                            <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                                {subFields.map((subField) => (
                                                    <SpaceForm key={subField.key}>
                                                        <Form.Item noStyle name={[subField.name, "value"]}>
                                                            <Input disabled={mode == "view" ? true : false} style={{ width: 300 }} />
                                                        </Form.Item>

                                                        {/* <Form.Item noStyle name={[subField.name, "detail"]}>
                                                            <Input.TextArea />
                                                        </Form.Item> */}

                                                        {mode != "view" ?
                                                            <CloseOutlined
                                                                onClick={() => {
                                                                    subOpt.remove(subField.name);
                                                                }}
                                                            />
                                                            : null}

                                                    </SpaceForm>
                                                ))}
                                                {mode != "view" ?
                                                    <Button type="dashed" onClick={() => subOpt.add()} block>
                                                        + Add Value
                                                    </Button>
                                                    : null}
                                            </div>
                                        )}
                                    </Form.List>
                                </Form.Item>
                            </Card>
                        ))}
                        {mode != "view" ?
                            <Button type="dashed" onClick={() => add()} block>
                                + Add Group
                            </Button>
                            : null}
                    </div>
                )}
            </Form.List>

            {/* View
            <Form.Item noStyle shouldUpdate>
                {() => (
                    <Typography>
                        <pre style={{ fontSize: 16 }}>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                    </Typography>
                )}
            </Form.Item>

            True
            <Form.Item noStyle shouldUpdate>
                {() => (
                    <Typography>
                        <pre style={{ fontSize: 16 }}>{JSON.stringify(demo, null, 2)}</pre>
                    </Typography>
                )}
            </Form.Item> */}
        </>
    )
}

export default InternationalRelationsTopics