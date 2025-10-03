"use client";

import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import apiService from "@/app/services/apiService";

type LoginModalProps = {
  open: boolean;
  close: () => void;
  success: () => void;
};

function LoginModal({ open, close, success }: LoginModalProps) {
  const [form] = Form.useForm();

  const onFinish = async (formData: {
    email: string;
    password1: string;
    password2: string;
  }) => {
    success();
  };

  return (
    <Modal
      title={<div style={{ textAlign: "center", width: "100%" }}>Login</div>}
      open={open}
      centered
      getContainer={false}
      footer={null}
      onCancel={close}
      destroyOnHidden
    >
      <Form
        form={form}
        name="register"
        style={{ maxWidth: 275, margin: "auto" }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            { type: "email", message: "The input is not valid E-mail!" },
            { required: true, message: "Please input your E-mail!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default LoginModal;
