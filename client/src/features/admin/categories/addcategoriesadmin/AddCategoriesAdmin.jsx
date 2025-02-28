import React from 'react'
import {
  Button, Form, Input, Row, Col,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const AddCategoriesAdmin = () => {
  const onFinish = async (values) => {
    console.log(values)
  };
  return (
    <>
        <Form layout="vertical" autoComplete="off"  onFinish={onFinish}>
          <Col span={12}>
            <Form.Item
              label="Tên danh mục"
              name="name"
              rules={[{ message: 'Không được bỏ trống!', required: true, min: 3 }]}
            >
              <Input className='w-[450px]' />
            </Form.Item>
          </Col>
          <Row>
            <Button type="primary" className="bg-blue-500" htmlType="submit">
              Thêm danh mục
            </Button>
          </Row>
        </Form>
        </>
  )
}

export default AddCategoriesAdmin