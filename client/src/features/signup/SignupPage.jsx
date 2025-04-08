import { useRef, useState } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { userRegister } from './RegisterUser';
import { User } from 'lucide-react';
import Login from '../login/Login';
import ForgotPassword from '../forgotpassword/ForgotPasswordPage';

const SignupPage = () => {
    const [form] = Form.useForm();
    const { mutate: signup, isLoading } = userRegister();
    const [isVerified, setIsVerified] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
    const recaptchaRef = useRef();

    const onFinish = async (values) => {
        if (isVerified) {
            signup(values, {
                onSuccess: () => {
                    message.success("Đăng ký thành công!");
                    setIsSignupModalOpen(false); // Đóng modal Đăng ký
                    setIsLoginModalOpen(true); // Mở modal Đăng nhập
                },
                onError: (error) => {
                    message.error(error.response?.data?.message || "Đăng ký thất bại!");
                },
            });
            form.resetFields(); // Reset form sau khi Đăng ký thành công
        } else {
            message.error('Vui lòng xác nhận bạn không phải người máy');
        }
    };

    const handleRecaptcha = (value) => {
        if (value) {
            setIsVerified(true);
        }
    };

    return (
        <>
            <User onClick={() => setIsSignupModalOpen(true)} size={22} />

            {/* Modal Đăng ký */}
            <Modal
                footer={null}
                open={isSignupModalOpen}
                onCancel={() => setIsSignupModalOpen(false)}
            >
                <Form
                    className="mt-[30px] mx-auto my-8 sm:w-[468px] px-4"
                    name="form_item_path"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <h1 className="text-xl font-bold text-center leading-6 text-gray-800">
                        Đăng ký
                    </h1>
                    <Form.Item
                        className="text-black font-bold"
                        rules={[
                            {
                                message: 'Vui lòng nhập tên của bạn!',
                                required: true,
                                min: 3,
                            },
                        ]}
                        name="name"
                        label="Họ tên"
                    >
                        <Input
                            className="font-mono border border-gray-700 h-[48px]"
                            placeholder="Nhập họ tên"
                        />
                    </Form.Item>
                    <Form.Item
                        className="text-black font-bold"
                        name="email"
                        label="Email"
                        rules={[
                            {
                                message: 'Vui lòng nhập email!',
                                required: true,
                                type: 'email',
                            },
                        ]}
                    >
                        <Input
                            className="border-gray-700 font-mono border h-[48px]"
                            placeholder="Nhập email"
                        />
                    </Form.Item>
                    <Form.Item
                        className="text-black font-bold"
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            {
                                message: 'Vui lòng nhập mật khẩu!',
                                required: true,
                                min: 6,
                            },
                        ]}
                    >
                        <Input.Password
                            type="password"
                            className="font-mono border border-gray-700 h-[48px]"
                            placeholder="Nhập mật khẩu"
                            iconRender={(visible) =>
                                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        className="text-black font-bold"
                        name="confirmpassword"
                        label="Nhập lại mật khẩu"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            type="password"
                            className="font-mono border border-gray-700 h-[48px]"
                            placeholder="Nhập lại mật khẩu"
                            iconRender={(visible) =>
                                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                            }
                        />
                    </Form.Item>
                    <Form.Item>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6Ld_Ek8mAAAAAKtnDYdUCNiClx9m52L_aafio6we"
                            onChange={handleRecaptcha}
                        />
                        {isVerified ? (
                            <p>Xác thực thành công!</p>
                        ) : (
                            <p className="text-[red]">
                                Vui lòng xác thực bằng Recaptcha trước khi tiếp tục.
                            </p>
                        )}
                    </Form.Item>
                    <Button
                        htmlType="submit"
                        className="w-full h-[52px] text-center py-3 rounded text-[20px] bg-[#171515] hover:bg-blue-600 text-white hover:bg-green-dark focus:outline-none my-1"
                    >
                        Đăng ký
                    </Button>
                    <p className="text-sm mt-4 font-medium leading-none text-gray-500">
                        Bạn đã có tài khoản?{' '}
                        <span
                            className="text-sm font-medium leading-none underline text-gray-800 cursor-pointer"
                            onClick={() => {
                                setIsSignupModalOpen(false);
                                setIsLoginModalOpen(true);
                            }}
                        >
                            Đăng nhập ngay
                        </span>
                    </p>
                </Form>
            </Modal>

            {/* Modal Đăng nhập */}
            <Login
                isModalOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onForgotPassword={() => {
                    setIsLoginModalOpen(false);
                    setIsForgotPasswordModalOpen(true);
                }}
                setIsSignupModalOpen={setIsSignupModalOpen} // Truyền hàm mở modal Đăng ký
            />

            {/* Modal Quên mật khẩu */}
            <ForgotPassword
                isModalOpen={isForgotPasswordModalOpen}
                onClose={() => setIsForgotPasswordModalOpen(false)}
            />
        </>
    );
};

export default SignupPage;