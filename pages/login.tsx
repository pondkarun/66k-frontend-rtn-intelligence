import { useEffect, useState } from "react";
import Router from "next/router";
import Head from 'next/head';
import styled from "styled-components";
import { Cookies } from 'react-cookie';
import { Layout, Button, Form, Input, message } from "antd";
import { UnlockOutlined, UserOutlined } from "@ant-design/icons";
import { imgSrc, primary_color } from "./_app";
import { loginService } from "@/services/auth";
import { useSelector } from 'react-redux';
import { isArray } from 'lodash'

const Wrapper = styled(Layout.Content)`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
    background: #0a183d;
    flex-direction: column;
    background-image: url('/images/page/login/background.png');
    width: 100%;
    background-position: left;
    background-repeat: no-repeat;
    background-size: cover;
`;

const Card = styled.div`
    padding: 50px;
    justify-content: center;
    align-items: center;
    width: 50%;
    max-width: 700px;
    min-width: 700px;
    height: 700px;
    background: #ffffff00;

    background-image: url('/images/page/login/frame_horizontal.png');
    width: 100%;
    background-position: left;
    background-repeat: no-repeat;
    background-size: cover;

    @media only screen and (max-width: 640px) {
        max-width: 600px;
        min-width: 600px;
        height: 600px;
    }

    @media only screen and (max-width: 550px) {
        background-image: url('/images/page/login/frame_vertical.png');
        max-width: 400px;
        min-width: 400px;
        height: 590px;
    }
   
`;

const Logo = styled.div`
    margin-top: 50px;
    img {
        height: 210px;
        padding-top: 10px;
    }

    @media only screen and (max-width: 640px) {
        margin-top: 20px;
    }

    @media only screen and (max-width: 550px) {
        img {
            height: 155px;
            padding-top: 10px;
        }
    }
`
const FormLogin = styled(Form)`
    margin-top: 25px;
    padding: 30px 75px 0 75px;
    .ant-input-affix-wrapper {
        background-color: #ffffff00;
        color: ${primary_color};
        border-width: 0px;
        border-bottom: 1px solid ${primary_color};
        border-radius: 0px;

        .ant-input {
            background-color: #ffffff00;
            color: ${primary_color};
            padding-left: 15px;
        }
        .anticon.ant-input-password-icon {
            color: ${primary_color};
            cursor: pointer;
            transition: all 0.3s;
        }
        input::placeholder {
            color: ${primary_color};
        }
       
    }
    .ant-input-affix-wrapper-status-error {
        input::placeholder {
            color: #ff4d4f;
        }
    }
    @media only screen and (max-width: 640px) {
        margin-top: 0px !important;
    }
    @media only screen and (max-width: 550px) {
        padding: 40px 0px 0 0px;
    }
`

const ButtonLogin = styled(Button)`
    margin-top: 30px;
    border: 1px solid ${primary_color};
    background-color: #e4b35400;
    font-size: 25px !important;
    height: 60px !important;
    border-radius: 0px !important;
    color: ${primary_color};
    &:hover {
        color: #0b1741 !important;
    }

    @media only screen and (max-width: 550px) {
        font-size: 20px !important;
        height: 50px !important;
    }
`

const LoginPage = () => {

    const { profile, access_token } = useSelector(({ auth }) => auth);
    useEffect(() => {
        if (profile && access_token) {
            Router.push('/');
        }
        /* guest_access del */
        cookies.remove("access_token", { path: '/' });
        cookies.remove("refresh_token", { path: '/' });
    }, [profile, access_token]);

    const cookies = new Cookies();
    const [isError, setIsError] = useState<any>({
        username: {
            validateStatus: "",
            help: "",
        },
        password: {
            validateStatus: "",
            help: "",
        },
    });

    const onFinish = async (values: any) => {
        try {
            // console.log('value 1 :>> ', values);
            const { username, password } = values;
            if (!username && !password) {
                setIsError({
                    username: {
                        validateStatus: "error",
                        help: "กรุณรกรอกชื่อผู้ใช้งาน!",
                    },
                    password: {
                        validateStatus: "error",
                        help: "กรุณากรอกรหัสผ่าน!",
                    },
                });
            } else if (!username) {
                setIsError({
                    username: {
                        validateStatus: "error",
                        help: "กรุณรกรอกชื่อผู้ใช้งาน!",
                    },
                });
            } else if (!password) {
                setIsError({
                    password: {
                        validateStatus: "error",
                        help: "กรุณากรอกรหัสผ่าน!",
                    },
                });
            } else {
                setIsError({});
                const res: any = await loginService({ username, password });
                const data = res.data.data;
                const error = res.data.error;
                const errors = res.data.errors;
                if (data) {
                    cookies.set("access_token", data.access_token, { path: "/" });
                    cookies.set("refresh_token", data.refresh_token, { path: "/" });
                    Router.push('/');
                } else if (error) {
                    message.error(error.message)
                } else if (isArray(errors)) {
                    message.error(errors[0].msg)

                }

            }
        } catch (error) {
            message.error("มีบางอย่างผิดพลาด")
            console.log('error', error)
        }
    }

    const register = () => {
        Router.push('/register');
    }

    return (
        <Wrapper>
            <Head>
                <title>เข้าสู่ระบบ</title>
            </Head>

            <Card>
                <Logo>
                    <img src={imgSrc} />
                </Logo>
                <FormLogin
                    name="login"
                    style={{ marginTop: "25px" }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        validateStatus={isError.username?.validateStatus}
                        help={isError.username?.help}
                        name="username"
                    >
                        <Input size="large" placeholder="ชื่อผู้ใช้งาน" prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item
                        validateStatus={isError.password?.validateStatus}
                        help={isError.password?.help}
                        name="password"
                    >
                        <Input.Password size="large" placeholder="รหัสผ่าน" prefix={<UnlockOutlined />} />
                    </Form.Item>
                    <Form.Item>
                        <ButtonLogin size="large" type="primary" htmlType="submit" style={{ width: "100%" }}>
                            เข้าสู่ระบบ
                        </ButtonLogin>
                    </Form.Item>
                </FormLogin>
            </Card>
        </Wrapper>
    )
}

export default LoginPage