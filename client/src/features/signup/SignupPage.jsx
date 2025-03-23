import { useRef, useState } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { userRegister } from './RegisterUser';
import { Link } from "react-router-dom";

const SignupPage = () => {
    const [form] = Form.useForm();
    const { mutate: Login, isLoading } = userRegister();
    const [isVerified, setIsVerified] = useState(false);
    const recaptchaRef = useRef()
    const onFinish = async (values) => {
        if (isVerified == true) {
            Login(values);
            form.resetFields(); // Reset form after successful submission
        } else {
            message.error('vui lòng xác nhận bạn không phải người máy')
        }
    };

    const handleRecaptcha = (value) => {
        if (value) {
            setIsVerified(true);
        }
    };

    const resetRecaptcha = () => {
        setIsVerified(false);
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
    };

    return (
        <>
            <Form className="mt-[30px] mx-auto my-8 sm:w-[468px] px-4" name="form_item_path" layout="vertical" onFinish={onFinish} autoComplete="off">
                <h1 tabIndex={0} role="heading" aria-label="Login to your account" className="text-xl font-bold text-center leading-6 text-gray-800">
                    Đăng ký
                </h1>
                <Form.Item className='text-black font-bold'
                    rules={[
                        {
                            message: 'Vui lòng nhập tên của bạn!',
                            required: true,
                            min: 3
                        },
                    ]}
                    name="name"
                    label="Họ tên"
                >
                    <Input className='font-mono border border-gray-700 h-[48px]' placeholder="Nhập họ tên" />
                </Form.Item>
                <Form.Item className='text-black font-bold'
                    name="email"
                    label="Email"
                    rules={[
                        {
                            message: 'vui lòng nhập email!',
                            required: true,
                            type: 'email'
                        },
                    ]}
                >
                    <Input className='border-gray-700 font-mono border h-[48px]' placeholder="Nhập email" />
                </Form.Item>
                <Form.Item className='text-black font-bold'
                    name="password"
                    label="Mật khẩu"
                    rules={[
                        {
                            message: 'Vui lòng nhập mật khẩu!',
                            required: true,
                            min: 6
                        },
                    ]}
                >
                    <Input.Password
                        type='password' className='font-mono border border-gray-700 h-[48px]' placeholder="Nhập mật khẩu"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>
                <Form.Item className='text-black font-bold'
                    name="confirmpassword"
                    label="Nhập lại mật khẩu"
                    dependencies={["password"]}
                    rules={[
                        { required: true, message: "vui lòng nhập lại mật khẩu!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("mật khẩu không khớp!"));
                            },
                        }),
                    ]}

                >
                    <Input.Password
                        type='password' className='font-mono border border-gray-700 h-[48px]' placeholder="Nhập lại mật khẩu"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>
                <Form.Item >
                    <ReCAPTCHA className=''
                        ref={recaptchaRef}
                        sitekey="6Ld_Ek8mAAAAAKtnDYdUCNiClx9m52L_aafio6we"
                        onChange={handleRecaptcha}
                    />
                    {isVerified ? (
                        <p>Xác thực thành công!</p>
                    ) : (
                        <p className='text-[red]'>Vui lòng xác thực bằng Recaptcha trước khi tiếp tục.</p>
                    )}
                </Form.Item>
                <Button
                    htmlType="submit"
                    className="w-full h-[52px] text-center py-3 rounded text-[20px] bg-[#02c4c4] hover:bg-blue-600 text-white hover:bg-green-dark focus:outline-none my-1"
                >
                    Đăng ký
                </Button>
                <p className="text-sm mt-4 font-medium leading-none text-gray-500">
                    bạn đã có tài khoản ?{" "}
                    <Link to='/signin' aria-label="Sign up here" className="text-sm font-medium leading-none underline text-gray-800 cursor-pointer">

                        Đăng nhập ngay
                    </Link>
                </p>
            </Form>
        </>
    );
}

export default SignupPage