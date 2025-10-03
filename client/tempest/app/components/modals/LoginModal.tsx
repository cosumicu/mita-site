"use client";

import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onLogin: (values: { email: string; password: string }) => void;
};

function LoginModal({ open, onClose, onLogin }: LoginModalProps) {
  const [form] = Form.useForm();

  const onFinish = (values: {
    email: string;
    username: string;
    password: string;
    re_password: string;
    agreement: boolean;
  }) => {
    onLogin(values);
    form.resetFields();
  };

  return (
    <Modal
      title={<div style={{ textAlign: "center", width: "100%" }}>Login</div>}
      open={open}
      centered
      getContainer={false}
      footer={null}
      onCancel={onClose}
      destroyOnHidden
    >
      <Form
        form={form}
        name="register"
        style={{ maxWidth: 275, margin: "auto" }}
        onFinish={onFinish}
      >
        {/* Email */}
        <Form.Item
          name="email"
          rules={[
            { type: "email", message: "The input is not valid E-mail!" },
            { required: true, message: "Please input your E-mail!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default LoginModal;
